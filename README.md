# プロジェクトの説明

このプロジェクトは、HTMLフォームのバリデーションを行うJavaScriptライブラリです。以下の機能があります。

- 必須項目のチェック
- 電話番号の形式チェック（ハイフンあり/なし）
- メールアドレスの形式チェック
- 郵便番号の形式チェック（ハイフンあり/なし）
- 数字のみの入力チェック
- カタカナのみの入力チェック
- メールアドレスの一致チェック
- チェックボックスの選択チェック
- 必須項目の数をカウント
- 郵便番号jsの自動入力に対応
- カスタムエラーメッセージ機能

## 使い方

1. `FormValidator.js`をプロジェクトに追加します。
2. HTMLフォームの各入力項目に`data-validate`属性を追加します。この属性には、以下の値をカンマ区切りで設定できます。
    - `required`: 必須項目
    - `name`: 名前
    - `furigana`: フリガナ
    - `tel`: 電話番号
    - `email`: メールアドレス
    - `postal-code`: 郵便番号
    - `postal-auto`: 郵便番号入力時の住所自動入力に対応
    - `postal`: 住所
    - `number`: 数字のみ
    - `hiragana`: ひらがな
    - `katakana`: カタカナのみ
    - `email-conf`: メールアドレスの一致
    - `password`: パスワード
    - `text`: テキストエリア
    - `emesse1`: カスタムエラーメッセージ
    - `agree`: 同意チェックボックス
3. チェックボックスのグループには`data-check_validate`属性を追加します。この属性には、`required`を設定します。
4. フォームの送信ボタンには`data-submit`属性を追加します。
5. `DOMContentLoaded`イベントで`FormValidator.init`メソッドを呼び出します。このメソッドには、オプションをオブジェクト形式で渡すことができます。


## 例

以下は、このライブラリを使用したHTMLフォームの例です。
```html
<body>
    <form class="h-adr">
        <input type="hidden" class="p-country-name" value="Japan">
        <p>あと<span data-count_validate="true"></span>項目入力してください。</p>
        <div class="form-item">
            <div class="form-key">名前<span class="required">(必須)</span></div>
            <div class="form-val">
                <input type="text" id="myInput" name="name" data-validate="required,name" value="">
                <p class="error-text" data-text="error"></p>
            </div>
        </div>
        <div class="form-item">
            <div class="form-key">ふりがな<span class="required">(必須)</span></div>
            <div class="form-val">
                <input type="text" data-validate="required,furigana,hiragana">
                <p class="error-text" data-text="error"></p>
            </div>
        </div>
        <div class="form-item">
            <div class="form-key">フリガナ<span class="required">(必須)</span></div>
            <div class="form-val">
                <input type="text" data-validate="required,furigana,katakana">
                <p class="error-text" data-text="error"></p>
            </div>
        </div>
        <div class="form-item">
            <div class="form-key">電話番号<span class="required">(必須)</span></div>
            <div class="form-val">
                <input type="text" name="name" data-validate="required,tel">
                <p class="error-text" data-text="error"></p>
            </div>
        </div>
        <div class="form-item">
            <div class="form-key">メールアドレス<span class="required">(必須)</span></div>
            <div class="form-val">
                <input type="email" name="mailaddress" data-validate="required,email">
                <p class="error-text" data-text="error"></p>
            </div>
        </div>
        <div class="form-item">
            <div class="form-key">メールアドレス確認<span class="required">(必須)</span></div>
            <div class="form-val">
                <input type="email" name="mail-conf" data-validate="required,email-conf">
                <p class="error-text" data-text="error"></p>
            </div>
        </div>
        <div class="form-item">
            <div class="form-key">郵便番号<span class="required">(必須)</span></div>
            <div class="form-val">
                〒<input type="text" class="p-postal-code" data-validate="required,postal-code" size="8" maxlength="8">
                <p class="error-text" data-text="error"></p>
            </div>
        </div>
        <div class="form-item">
            <div class="form-key">住所1<span class="required">(必須)</span></div>
            <div class="form-val">
                <input type="text" class="p-region p-locality" data-validate="required,postal,postal-auto">
                <p class="error-text" data-text="error"></p>
            </div>
        </div>
        <div class="form-key">住所2<span class="required">(必須)</span></div>
            <div class="form-val">
                <input type="text" class="p-street-address p-extended-address" data-validate="required,postal,postal-auto">
                <p class="error-text" data-text="error"></p>
            </div>
        </div>
        <div class="form-item">
            <div class="form-key">お問い合わせ内容<span class="required">(必須)</span></div>
            <div class="form-val">
                <textarea name="message" data-validate="required,text"></textarea>
                <p class="error-text" data-text="error"></p>
            </div>
        </div>
        <div class="form-item">
            <div class="form-key">数字</div>
            <div class="form-val">
                <input type="tel" name="num" data-validate="required,number,emesse1">
                <p class="error-text" data-text="error"></p>
            </div>
        </div>
        <div class="form-item">
            <div class="form-key">都道府県<span class="required">(必須)</span></div>
            <div class="form-val" data-select_validate="required,emesse2">
                <select name="prefectures">
                <option value="">-----</option>
                <option value="01">北海道</option>
                <option value="47">沖縄</option>
                </select>
                <p class="error-text" data-text="error"></p>
            </div>
        </div>
        <div class="form-item">
            <div class="form-key">連絡方法<span class="required">(必須)</span></div>
            <div class="form-val" data-check_validate="required,emesse3">
                <input type="checkbox" id="contact1" name="contact[1]" value="メール">
                <label for="contact1">メール</label>
                <input type="checkbox" id="contact2" name="contact[1]" value="電話">
                <label for="contact2">電話</label>
                <input type="checkbox" id="contact3" name="contact[1]" value="郵送">
                <label for="contact3">郵送</label>
                <p class="error-text" data-text="error"></p>
            </div>
        </div>
        <div class="form-item">
            <div class="form-key">連絡方法<span class="required">(必須)</span></div>
            <div class="form-val" data-radio_validate="required,emesse3">
                <input type="radio" id="contact7" name="contact[3]" value="メール">
                <label for="contact7">メール</label>
                <input type="radio" id="contact8" name="contact[3]" value="電話">
                <label for="contact8">電話</label>
                <input type="radio" id="contact9" name="contact[3]" value="郵送">
                <label for="contact9">郵送</label>
                <p class="error-text" data-text="error"></p>
            </div>
        </div>
        <div class="form-item">
            <div class="form-key">パスワード<span class="required">(必須)</span></div>
            <div class="form-val">
                <input type="password" name="password" data-validate="required,password">
                <p class="error-text" data-text="error"></p>
            </div>
        </div>
        <div class="form-item">
            <div class="form-val" data-check_validate="required,agree">
                <input type="checkbox" id="agree" name="agree[1]" value="同意する">
                <label for="agree">同意する</label>
                <p class="error-text" data-text="error"></p>
            </div>
        </div>
        <button type="submit" data-submit="submit" >送信</button>
    </form>

    <script defer src="./FormValidator.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            FormValidator.init({
                    count: true,
                },
                {
                    emesse1: '数字を入力してください。',
                    emesse2: '都道府県を選択してください。',
                    emesse3: '連絡方法を選択してください。',
                }
            );
        });
    </script>
</body>
```

## オプションについて
    - allowHyphensInTel: null, // 電話番号にハイフンを許可するか（初期値どちらも許容）
    - allowHyphensInPostalCode: null, // 郵便番号にハイフンを許可するか（初期値どちらも許容）
    - count: false, // カウント表示を有効にするか（初期値：false）
    - disableSubmitOnError: true, // エラーがある場合にsubmitボタンを無効化する（初期値：true）
    - usePostalCodeJS: false, // 郵便番号jsを使用するか（初期値：false）

## エラーメッセージについて
    - emesse1: '数字を入力してください。', // 必須条件時にオリジナルのエラーメッセージを追加可能（data-check_validate="required,emesse1"のようにdataを付与）


