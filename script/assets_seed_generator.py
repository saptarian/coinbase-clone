import requests, os


def loop_and_write(file, data, is_fiat):
    for item in data:
        file.write("\t('{}', '{}', '{}', {}, {}),\n".format(
            item.get('name').replace("'", "''"),
            item.get('symbol'),
            item.get('symbol') if is_fiat else item.get('slug'),
            True if is_fiat else False,
            True
        ))


def main(port):
    url = f"http://localhost:{port}/cryptocurrency"

    with open('assets_seed.sql', 'w', encoding='utf-8') as ff:
        ff.write("INSERT INTO \"assets\"\n")
        ff.write("\t(name, symbol, slug, is_fiat, is_active)\n")
        ff.write("VALUES\n")
        fiat_map = requests.get(f'{url}/fiat').json()
        sorted_fiat = sorted( fiat_map.values(), key=lambda x: x["id"] )
        loop_and_write(ff, sorted_fiat, True)
        symbol_list = [v.get("symbol") for v in sorted_fiat]
        crypto_map = requests.get(f'{url}/id-map?page=1').json()
        ranked_cryptos = sorted( crypto_map.values(), key=lambda x: x["rank"], reverse=True )
        unique_symbol = list({crypto["symbol"]: crypto for crypto in ranked_cryptos \
            if crypto.get('symbol') and crypto['symbol'] not in symbol_list }.values())
        unique_symbol.reverse()
        loop_and_write(ff, unique_symbol , False)
        ff.write("\t('end_of_line', 'EOL', 'unknown', {}, {});".format(False, False))


if __name__ == '__main__':
    port = 80
    if len(os.sys.argv) > 1:
        port = os.sys.argv[1] 

    main(port)

