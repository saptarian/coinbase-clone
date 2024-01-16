import requests


def loop_and_write(file, data, is_fiat):
    for item in data:
        file.write("\t('{}', '{}', '{}', {}, 1),\n".format(
            item.get('name').replace("'", "''"),
            item.get('symbol'),
            item.get('symbol') if is_fiat else item.get('slug'),
            1 if is_fiat else 0
        ))


def main():
    with open('assets_seed.sql', 'w', encoding='utf-8') as ff:
        ff.write("INSERT INTO 'assets'\n")
        ff.write("\t(name, symbol, slug, is_fiat, is_active)\n")
        ff.write("VALUES\n")
        loop_and_write(
            ff,
            requests.get(
                'http://127.0.0.1:8080/fiat-map.json'
            ).json().get('data'),
            True
        )
        loop_and_write(
            ff,
            requests.get(
                'http://127.0.0.1:8080/list-crypto.json'
            ).json().get('data'),
            False
        )
        ff.write("\t('end_of_line', 'EOL', 'unknown', 0, 0);")


if __name__ == '__main__':
    main()

