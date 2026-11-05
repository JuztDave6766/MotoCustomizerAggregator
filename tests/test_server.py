import unittest

from server import absolute_image, is_public_host, parse_meta, parse_price


class ParseMetaTest(unittest.TestCase):
    def test_collects_open_graph_and_named_meta(self):
        page = """
        <html><head>
          <meta property="og:title" content="Scarico Akrapovic Slip-On" />
          <meta property="og:site_name" content="MotoShop" />
          <meta property="product:price:amount" content="689.00" />
          <meta name="twitter:image" content="https://cdn.motoshop.it/scarico.jpg" />
        </head></html>
        """
        meta = parse_meta(page)

        self.assertEqual(meta["og:title"], "Scarico Akrapovic Slip-On")
        self.assertEqual(meta["og:site_name"], "MotoShop")
        self.assertEqual(meta["product:price:amount"], "689.00")
        self.assertEqual(meta["twitter:image"], "https://cdn.motoshop.it/scarico.jpg")

    def test_first_duplicate_wins(self):
        page = """
        <meta property="og:title" content="Primo" />
        <meta property="og:title" content="Secondo" />
        """
        self.assertEqual(parse_meta(page)["og:title"], "Primo")


class ParsePriceTest(unittest.TestCase):
    def test_meta_price(self):
        meta = {"product:price:amount": "689.00"}
        self.assertEqual(parse_price("<html></html>", meta), 689.0)

    def test_json_ld_price(self):
        page = '<script type="application/ld+json">{"offers":{"price":"1299.00"}}</script>'
        self.assertEqual(parse_price(page, {}), 1299.0)

    def test_italian_thousands(self):
        meta = {"product:price:amount": "1.299,00"}
        self.assertEqual(parse_price("<html></html>", meta), 1299.0)

    def test_english_thousands(self):
        meta = {"product:price:amount": "1,299.00"}
        self.assertEqual(parse_price("<html></html>", meta), 1299.0)

    def test_small_decimal_comma(self):
        meta = {"product:price:amount": "12,50"}
        self.assertEqual(parse_price("<html></html>", meta), 12.5)

    def test_itemprop_microdata(self):
        page = '<span itemprop="price" content="249.90">€ 249,90</span>'
        self.assertEqual(parse_price(page, {}), 249.9)

    def test_missing_price(self):
        self.assertIsNone(parse_price("<html><body>ciao</body></html>", {}))

    def test_absurd_price_is_rejected(self):
        meta = {"product:price:amount": "999999"}
        self.assertIsNone(parse_price("<html></html>", meta))


class AbsoluteImageTest(unittest.TestCase):
    def test_relative_image(self):
        self.assertEqual(
            absolute_image("/img/scarico.jpg", "https://motoshop.it/prodotti/scarico"),
            "https://motoshop.it/img/scarico.jpg",
        )

    def test_empty_image(self):
        self.assertEqual(absolute_image("", "https://motoshop.it"), "")


class PublicHostTest(unittest.TestCase):
    def test_rejects_private_and_loopback(self):
        self.assertFalse(is_public_host("127.0.0.1"))
        self.assertFalse(is_public_host("localhost"))
        self.assertFalse(is_public_host("192.168.1.10"))
        self.assertFalse(is_public_host("10.0.0.5"))

    def test_accepts_public_ip_literal(self):
        self.assertTrue(is_public_host("93.184.216.34"))


if __name__ == "__main__":
    unittest.main()
