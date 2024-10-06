class FormValidator {
    constructor() {
        this.inputs = null;
        this.checkboxContainers = null;
        this.radioboxContainers = null;
        this.submitButton = null;
        // オプション設定
        this.options = {
            allowHyphensInTel: null, // 電話番号にハイフンを許可するか
            allowHyphensInPostalCode: null, // 郵便番号にハイフンを許可するか
            count: false, // カウント表示を有効にするか
            disableSubmitOnError: true, // エラーがある場合にsubmitボタンを無効化する
            usePostalCodeJS: false, // 郵便番号jsを使用するか
        };
        // エラーメッセージ
        this.errorMessages = {
            required: 'この項目は入力必須です。',
            requiredName: 'お名前を入力してください。',
            requiredFuriganaHira: 'ふりがなを入力してください。',
            requiredFuriganaKana: 'フリガナを入力してください。',
            requiredPostalCode: '郵便番号を入力してください。',
            requiredPostal: '住所を入力してください。',
            requiredTel: '電話番号を入力してください。',
            requiredEmail: 'メールアドレスを入力してください。',
            requiredEmailConf: '確認用メールアドレスを入力してください。',
            requiredPassword: 'パスワードを入力してください。',
            requiredText: 'お問い合わせ内容を入力してください。',
            tel: '電話番号の形式が正しくありません。',
            telWithHyphens: '電話番号はハイフン付きの形式で入力してください。',
            telWithoutHyphens: '電話番号はハイフンなしの形式で入力してください。',
            email: 'メールアドレスの形式が正しくありません。',
            postalCode: '郵便番号の形式が正しくありません。',
            postalCodeWithHyphens: '郵便番号はハイフン付きの形式で入力してください。',
            postalCodeWithoutHyphens: '郵便番号はハイフンなしの形式で入力してください。',
            number: '半角数字で入力してください。',
            hiragana: '全角ひらがなで入力してください。',
            katakana: '全角カタカナで入力してください。',
            emailMismatch: 'メールアドレスが一致しません。',
            checkbox: 'チェックボックスを選択してください。',
            radiobox: 'ラジオボタンを選択してください。',
            halfWidth: '半角数字で入力してください。',
            password: '半角英数字をそれぞれ含む8文字以上16文字以下で入力してください。',
            agree: '個人情報保護方針の同意にチェックを入れてください。',
        };
        // バリデーションパターン
        this.validationPatterns = {
            telWithHyphens: /^0(((\d{1}-\d{4}|\d{2}-\d{3,4}|\d{3}-\d{2,3}|\d{4}-\d{1})-\d{4})|\d{3}-\d{3}-\d{3})$/,
            telWithoutHyphens: /^0\d{9,10}$/,
            email: /^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/,
            postalCodeWithHyphens: /^\d{3}-\d{4}$/,
            postalCodeWithoutHyphens: /^\d{7}$/,
            number: /^\d+$/,
            hiragana: /^[ぁ-んー　 ]+$/,
            katakana: /^[ァ-ヶー　 ]+$/,
            halfWidth: /^[0-9\-]+$/,
            password: /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,16}$/i, // 半角英数字をそれぞれ含む8文字以上16文字以下
        };
    }

    // 初期化関数
    init(options, errorMessages) {
        this.inputs = document.querySelectorAll('[data-validate]');
        this.selectContainers = document.querySelectorAll('[data-select_validate]');
        this.checkboxContainers = document.querySelectorAll('[data-check_validate]');
        this.radioboxContainers = document.querySelectorAll('[data-radio_validate]');
        this.submitButton = document.querySelector('[data-submit]');

        // 引数のoptionsをthis.optionsにマージ
        this.options = { ...this.options, ...options };
        // 引数のerrorMessagesをthis.errorMessagesにマージ
        this.errorMessages = { ...this.errorMessages, ...errorMessages };

        // エラーフラグ
        this.inputIsError = true;
        this.SelectIsError = true;
        this.CheckIsError = true;
        this.radioIsError = true;

        // 必須項目の数をカウント
        this.inputCount = document.querySelectorAll('[data-validate*="required"]').length;
        this.selectCount = document.querySelectorAll('[data-select_validate*="required"]').length;
        this.checkCount = document.querySelectorAll('[data-check_validate*="required"]').length;
        this.radioCount = document.querySelectorAll('[data-radio_validate*="required"]').length;

        // カウントオプションが有効な場合、カウント数を表示
        if (this.options.count) {
            this.countText = document.querySelector('[data-count_validate]');
            this.countText.innerText = this.inputCount + this.selectCount + this.checkCount + this.radioCount;
        }

        this.checkLoad();
        this.checkSubmit();
        this.checkInput();
        this.checkSelect();
        this.checkCheckbox();
        this.checkRadio();
        if(this.options.usePostalCodeJS) {
            this.checkPostalCode();
        }
    }

    replaceNum(num) {
        return num
            .replace(/[０-９]/g, function (s) {
                return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
            })
            .replace(/ー/g, '-')
            .replace(/－/g, '-');
    }

    checkLoad() {
        this.inputIsError = false;
        this.inputCount = 0;
        this.inputs.forEach((input) => {
            if (input.dataset.validate.includes('required')) {
                if (input.value === '' || input.classList.contains('error')) {
                    this.inputIsError = true;
                    this.inputCount += 1;
                }
            } else {
                if (input.classList.contains('error')) {
                    this.inputIsError = true;
                    this.inputCount += 1;
                }
            }
        });

        this.SelectIsError = false;
        this.selectCount = 0;
        this.selectContainers.forEach((container) => {
            const select = container.querySelector('select');
            if (select.value === '') {
                this.SelectIsError = true;
                this.selectCount += 1;
            }
        });

        this.CheckIsError = false;
        this.checkCount = 0;
        this.checkboxContainers.forEach((container) => {
            const checkboxes = container.querySelectorAll('input[type="checkbox"]');
            if (!Array.from(checkboxes).some((box) => box.checked)) {
                this.CheckIsError = true;
                this.checkCount += 1;
            }
        });

        this.radioIsError = false;
        this.radioCount = 0;
        this.radioboxContainers.forEach((container) => {
            const radioboxes = container.querySelectorAll('input[type="radio"]');
            if (!Array.from(radioboxes).some((box) => box.checked)) {
                this.radioIsError = true;
                this.radioCount += 1;
            }
        });
        this.checkSubmit();
    }

    checkSubmit() {
        if (this.options.disableSubmitOnError) {
            if (this.inputIsError || this.SelectIsError || this.CheckIsError || this.radioIsError) {
                this.submitButton.disabled = true;
            } else {
                this.submitButton.disabled = false;
            }
        } else {
            this.submitButton.disabled = false;
        }
    }

    checkInput() {
        // 入力フィールドごとにバリデーションを設定
        this.inputs.forEach((input) => {
            ['blur', 'change'].forEach((eventType) => {
                input.addEventListener(eventType, () => {
                    const validationTypes = input.dataset.validate.split(',');
                    const errorText = input.parentElement.querySelector('[data-text="error"]');
                    let flag = false;
                    validationTypes.forEach((type) => {
                        switch (type) {
                            case 'required':
                                // 必須項目のバリデーション
                                if (input.value.trim() === '') {
                                    input.classList.add('error');
                                    if (input.dataset.validate.includes('name')) {
                                        errorText.innerText = this.errorMessages.requiredName;
                                    } else if (input.dataset.validate.includes('furigana')) {
                                        if (input.dataset.validate.includes('hiragana')) {
                                            errorText.innerText = this.errorMessages.requiredFuriganaHira;
                                        } else if (input.dataset.validate.includes('katakana')) {
                                            errorText.innerText = this.errorMessages.requiredFuriganaKana;
                                        }
                                    } else if (input.dataset.validate.includes('postal-code')) {
                                        errorText.innerText = this.errorMessages.requiredPostalCode;
                                    } else if (input.dataset.validate.includes('postal')) {
                                        errorText.innerText = this.errorMessages.requiredPostal;
                                    } else if (input.dataset.validate.includes('tel')) {
                                        errorText.innerText = this.errorMessages.requiredTel;
                                    } else if (input.dataset.validate.includes('email-conf')) {
                                        errorText.innerText = this.errorMessages.requiredEmailConf;
                                    } else if (input.dataset.validate.includes('email')) {
                                        errorText.innerText = this.errorMessages.requiredEmail;
                                    } else if (input.dataset.validate.includes('password')) {
                                        errorText.innerText = this.errorMessages.requiredPassword;
                                    } else if (input.dataset.validate.includes('text')) {
                                        errorText.innerText = this.errorMessages.requiredText;
                                    } else {
                                        if (input.dataset.validate.includes('emesse')) {
                                            const emesseTypeMatch = input.dataset.validate.match(/emesse\d{1,2}/);
                                            const emesseType = emesseTypeMatch[0];
                                            errorText.innerText = this.errorMessages[emesseType];
                                        } else {
                                            errorText.innerText = this.errorMessages.required;
                                        }
                                    }
                                    flag = true;
                                } else {
                                    input.classList.remove('error');
                                    errorText.innerText = '';
                                }
                                break;
                            case 'tel':
                                // 電話番号のバリデーション
                                input.value = this.replaceNum(input.value);
                                if (flag) break;
                                if (input.value === '') {
                                    input.classList.remove('error');
                                    errorText.innerText = '';
                                    break;
                                }
                                if (!this.validationPatterns.halfWidth.test(input.value)) {
                                    input.classList.add('error');
                                    errorText.innerText = this.errorMessages.halfWidth;
                                    break;
                                }
                                let telValid = false;
                                if (this.options.allowHyphensInTel === true) {
                                    telValid = this.validationPatterns.telWithHyphens.test(input.value);
                                } else if (this.options.allowHyphensInTel === false) {
                                    telValid = this.validationPatterns.telWithoutHyphens.test(input.value);
                                } else if (this.options.allowHyphensInTel === null) {
                                    telValid = this.validationPatterns.telWithHyphens.test(input.value) || this.validationPatterns.telWithoutHyphens.test(input.value);
                                }
                                if (!telValid) {
                                    input.classList.add('error');
                                    errorText.innerText =
                                        this.options.allowHyphensInTel === null
                                            ? this.errorMessages.tel
                                            : this.options.allowHyphensInTel
                                              ? this.errorMessages.telWithHyphens
                                              : this.errorMessages.telWithoutHyphens;
                                } else {
                                    input.classList.remove('error');
                                    errorText.innerText = '';
                                }
                                break;
                            case 'email':
                                // メールアドレスのバリデーション
                                if (flag) break;
                                if (input.value === '') {
                                    input.classList.remove('error');
                                    errorText.innerText = '';
                                    break;
                                }
                                const emailConf = document.querySelector('input[data-validate*="email-conf"]');
                                if (!this.validationPatterns.email.test(input.value)) {
                                    input.classList.add('error');
                                    errorText.innerText = this.errorMessages.email;
                                } else {
                                    input.classList.remove('error');
                                    errorText.innerText = '';
                                }
                                // メールアドレス確認とのdiffチェック
                                if (emailConf && emailConf.value !== '') {
                                    if (input.value !== emailConf.value) {
                                        emailConf.classList.add('error');
                                        emailConf.nextElementSibling.innerText = this.errorMessages.emailMismatch;
                                    } else {
                                        emailConf.classList.remove('error');
                                        emailConf.nextElementSibling.innerText = '';
                                    }
                                }
                                break;
                            case 'email-conf':
                                // メールアドレス確認のバリデーション
                                if (flag) break;
                                if (input.value === '') {
                                    input.classList.remove('error');
                                    errorText.innerText = '';
                                    break;
                                }
                                const email = document.querySelector('input[data-validate*="email"]');
                                if (input.value !== email.value) {
                                    input.classList.add('error');
                                    errorText.innerText = this.errorMessages.emailMismatch;
                                } else {
                                    input.classList.remove('error');
                                    errorText.innerText = '';
                                }
                                break;
                            case 'postal-code':
                                // 郵便番号のバリデーション
                                input.value = this.replaceNum(input.value);
                                if (flag) break;
                                if (input.value === '') {
                                    input.classList.remove('error');
                                    errorText.innerText = '';
                                    break;
                                }
                                if (!this.validationPatterns.halfWidth.test(input.value)) {
                                    input.classList.add('error');
                                    errorText.innerText = this.errorMessages.halfWidth;
                                    break;
                                }
                                let postalCodeValid = false;
                                if (this.options.allowHyphensInPostalCode === true) {
                                    postalCodeValid = this.validationPatterns.postalCodeWithHyphens.test(input.value);
                                } else if (this.options.allowHyphensInPostalCode === false) {
                                    postalCodeValid = this.validationPatterns.postalCodeWithoutHyphens.test(input.value);
                                } else if (this.options.allowHyphensInPostalCode === null) {
                                    postalCodeValid = this.validationPatterns.postalCodeWithHyphens.test(input.value) || this.validationPatterns.postalCodeWithoutHyphens.test(input.value);
                                }
                                if (!postalCodeValid) {
                                    input.classList.add('error');
                                    errorText.innerText =
                                        this.options.allowHyphensInPostalCode === null
                                            ? this.errorMessages.postalCode
                                            : this.options.allowHyphensInPostalCode
                                            ? this.errorMessages.postalCodeWithHyphens
                                            : this.errorMessages.postalCodeWithoutHyphens;
                                } else {
                                    input.classList.remove('error');
                                    errorText.innerText = '';
                                    if(this.options.usePostalCodeJS) {
                                        const elements = document.querySelectorAll('[data-validate*="postal-auto"]');
                                        elements.forEach((element) => {
                                            if(element.value !== '') {
                                                element.classList.remove('error');
                                                element.nextElementSibling.innerText = '';
                                            }
                                        });
                                    }
                                }
                                break;
                            case 'number':
                                // 数字のバリデーション
                                if (flag) break;
                                if (input.value === '') {
                                    input.classList.remove('error');
                                    errorText.innerText = '';
                                    break;
                                }
                                if (!this.validationPatterns.halfWidth.test(input.value)) {
                                    input.classList.add('error');
                                    errorText.innerText = this.errorMessages.halfWidth;
                                    break;
                                }
                                if (!this.validationPatterns.number.test(input.value)) {
                                    input.classList.add('error');
                                    errorText.innerText = this.errorMessages.number;
                                } else {
                                    input.classList.remove('error');
                                    errorText.innerText = '';
                                }
                                break;
                            case 'hiragana':
                                // ひらがなのバリデーション
                                if (flag) break;
                                if (input.value === '') {
                                    input.classList.remove('error');
                                    errorText.innerText = '';
                                    break;
                                }
                                if (!this.validationPatterns.hiragana.test(input.value)) {
                                    input.classList.add('error');
                                    errorText.innerText = this.errorMessages.hiragana;
                                } else {
                                    input.classList.remove('error');
                                    errorText.innerText = '';
                                }
                                break;
                            case 'katakana':
                                // カタカナのバリデーション
                                if (flag) break;
                                if (input.value === '') {
                                    input.classList.remove('error');
                                    errorText.innerText = '';
                                    break;
                                }
                                if (!this.validationPatterns.katakana.test(input.value)) {
                                    input.classList.add('error');
                                    errorText.innerText = this.errorMessages.katakana;
                                } else {
                                    input.classList.remove('error');
                                    errorText.innerText = '';
                                }
                                break;
                            case 'password':
                                // パスワードのバリデーション
                                if (flag) break;
                                if (input.value === '') {
                                    input.classList.remove('error');
                                    errorText.innerText = '';
                                    break;
                                }
                                if (!this.validationPatterns.password.test(input.value)) {
                                    input.classList.add('error');
                                    errorText.innerText = this.errorMessages.password;
                                } else {
                                    input.classList.remove('error');
                                    errorText.innerText = '';
                                }
                                break;
                            default:
                                break;
                        }
                    });

                    // 全てのdata-validate属性を持つinput要素のうち、一つでもエラーがあればsubmitボタンを無効化する
                    // data-validate='required'のvalueが空でなく、かつ、errorクラスを持っていない要素があれば、submitボタンを有効化する
                    const inputs = document.querySelectorAll('[data-validate]');
                    this.inputIsError = false;
                    this.inputCount = 0;
                    inputs.forEach((input) => {
                        if (input.dataset.validate.includes('required')) {
                            if (input.value === '' || input.classList.contains('error')) {
                                this.inputIsError = true;
                                this.inputCount += 1;
                            }
                        } else {
                            if (input.classList.contains('error')) {
                                this.inputIsError = true;
                                this.inputCount += 1;
                            }
                        }
                    });
                    if (this.options.count) {
                        this.countText.innerText = this.inputCount + this.selectCount + this.checkCount + this.radioCount;
                    }
                    // inputIsErrorとCheckIsErrorのどちらかがtrueの場合、submitButtonを無効化する
                    this.checkSubmit();
                });
            });
        });
    }

    checkSelect() {
        this.selectContainers.forEach((container) => {
            if (container.dataset.select_validate.includes('required')) {
                const select = container.querySelector('select');
                const errorText = container.querySelector('[data-text="error"]');
                select.addEventListener('change', () => {
                    if (select.value === '') {
                        select.classList.add('error');
                        errorText.innerText = this.errorMessages.required;
                    } else {
                        select.classList.remove('error');
                        errorText.innerText = '';
                    }

                    // 全てのdata-select_validate属性を持つselect要素のうち、一つでもエラーがあればsubmitボタンを無効化する
                    // data-select_validate属性を持つdivの配下のselect要素が一つでも選択されていれば、submitボタンを有効化する
                    const selectContainers = document.querySelectorAll('[data-select_validate*="required"]');
                    this.SelectIsError = false;
                    this.selectCount = 0;
                    selectContainers.forEach((container) => {
                        const select = container.querySelector('select');
                        if (select.value === '') {
                            this.SelectIsError = true;
                            this.selectCount += 1;
                        }
                    });
                    if (this.options.count) {
                        this.countText.innerText = this.inputCount + this.selectCount + this.checkCount + this.radioCount;
                    }
                    // inputIsErrorとCheckIsErrorのどちらかがtrueの場合、submitButtonを無効化する
                    this.checkSubmit();
                });
            }
        });
    }

    checkCheckbox() {
        // チェックボックスごとにバリデーションを設定
        this.checkboxContainers.forEach((container) => {
            if (container.dataset.check_validate.includes('required')) {
                const checkboxes = container.querySelectorAll('input[type="checkbox"]');
                const errorText = container.querySelector('[data-text="error"]');
                checkboxes.forEach((checkbox) => {
                    checkbox.addEventListener('change', () => {
                        if (!Array.from(checkboxes).some((box) => box.checked)) {
                            checkboxes.forEach((box) => box.classList.add('error'));
                            if (container.dataset.check_validate.includes('agree')) {
                                errorText.innerText = this.errorMessages.agree;
                            } else {
                                if (container.dataset.check_validate.includes('emesse')) {
                                    const emesseTypeMatch = container.dataset.check_validate.match(/emesse\d{1,2}/);
                                    const emesseType = emesseTypeMatch[0];
                                    errorText.innerText = this.errorMessages[emesseType];
                                } else {
                                    errorText.innerText = this.errorMessages.checkbox;
                                }
                            }
                        } else {
                            checkboxes.forEach((box) => box.classList.remove('error'));
                            errorText.innerText = '';
                        }

                        // 全てのdata-check_validate属性を持つinput要素のうち、一つでもエラーがあればsubmitボタンを無効化する
                        // data-check_validate属性を持つdivの配下のinput要素が一つでもチェックされていれば、submitボタンを有効化する
                        const checkboxContainers = document.querySelectorAll('[data-check_validate*="required"]');
                        this.CheckIsError = false;
                        this.checkCount = 0;
                        checkboxContainers.forEach((container) => {
                            const checkboxes = container.querySelectorAll('input[type="checkbox"]');
                            if (!Array.from(checkboxes).some((box) => box.checked)) {
                                this.CheckIsError = true;
                                this.checkCount += 1;
                            }
                        });
                        if (this.options.count) {
                            this.countText.innerText = this.inputCount + this.selectCount + this.checkCount + this.radioCount;
                        }
                        // inputIsErrorとCheckIsErrorのどちらかがtrueの場合、submitButtonを無効化する
                        this.checkSubmit();
                    });
                });
            }
        });
    }

    checkRadio() {
        // radioボタンごとにバリデーションを設定
        this.radioboxContainers.forEach((container) => {
            if (container.dataset.radio_validate.includes('required')) {
                const radioboxes = container.querySelectorAll('input[type="radio"]');
                const errorText = container.querySelector('[data-text="error"]');
                radioboxes.forEach((radiobox) => {
                    radiobox.addEventListener('change', () => {
                        if (!Array.from(radioboxes).some((box) => box.checked)) {
                            checkboxes.forEach((box) => box.classList.add('error'));
                            if (container.dataset.radio_validate.includes('emesse')) {
                                const emesseTypeMatch = container.dataset.radio_validate.match(/emesse\d{1,2}/);
                                const emesseType = emesseTypeMatch[0];
                                errorText.innerText = this.errorMessages[emesseType];
                            } else {
                                errorText.innerText = this.errorMessages.radiobox;
                            }
                        } else {
                            radioboxes.forEach((box) => box.classList.remove('error'));
                            errorText.innerText = '';
                        }

                        // 全てのdata-radio_validate属性を持つinput要素のうち、一つでもエラーがあればsubmitボタンを無効化する
                        // data-radio_validate属性を持つdivの配下のinput要素が一つでもチェックされていれば、submitボタンを有効化する
                        const radioboxContainers = document.querySelectorAll('[data-radio_validate*="required"]');
                        this.radioIsError = false;
                        this.radioCount = 0;
                        radioboxContainers.forEach((container) => {
                            const radioboxes = container.querySelectorAll('input[type="radio"]');
                            if (!Array.from(radioboxes).some((box) => box.checked)) {
                                this.radioIsError = true;
                                this.radioCount += 1;
                            }
                        });
                        if (this.options.count) {
                            this.countText.innerText = this.inputCount + this.selectCount + this.checkCount + this.radioCount;
                        }
                        this.checkSubmit();
                    });
                });
            }
        });
    }

    checkPostalCode() {
        // // The MIT License (MIT)
        // // Copyright (c) 2015 Teruyuki Kobayashi
        // // Permission is hereby granted, free of charge, to any person obtaining a copy
        // // of this software and associated documentation files (the "Software"), to deal
        // // in the Software without restriction, including without limitation the rights
        // // to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        // // copies of the Software, and to permit persons to whom the Software is
        // // furnished to do so, subject to the following conditions:
        // // The above copyright notice and this permission notice shall be included in all
        // // copies or substantial portions of the Software.
        // // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        // // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        // // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        // // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        // // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        // // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
        // // SOFTWARE.
        const t = [];
        var YubinBango;
        !(function (YubinBango) {
            const n = (function () {
                function n(t, n) {
                    if (
                        (void 0 === t && (t = ''),
                        (this.URL = 'https://yubinbango.github.io/yubinbango-data/data'),
                        (this.g = [
                            null,
                            '北海道',
                            '青森県',
                            '岩手県',
                            '宮城県',
                            '秋田県',
                            '山形県',
                            '福島県',
                            '茨城県',
                            '栃木県',
                            '群馬県',
                            '埼玉県',
                            '千葉県',
                            '東京都',
                            '神奈川県',
                            '新潟県',
                            '富山県',
                            '石川県',
                            '福井県',
                            '山梨県',
                            '長野県',
                            '岐阜県',
                            '静岡県',
                            '愛知県',
                            '三重県',
                            '滋賀県',
                            '京都府',
                            '大阪府',
                            '兵庫県',
                            '奈良県',
                            '和歌山県',
                            '鳥取県',
                            '島根県',
                            '岡山県',
                            '広島県',
                            '山口県',
                            '徳島県',
                            '香川県',
                            '愛媛県',
                            '高知県',
                            '福岡県',
                            '佐賀県',
                            '長崎県',
                            '熊本県',
                            '大分県',
                            '宮崎県',
                            '鹿児島県',
                            '沖縄県',
                        ]),
                        t)
                    ) {
                        const e = t.replace(/[０-９]/g, function (t) {
                            return String.fromCharCode(t.charCodeAt(0) - 65248);
                        });
                        const r = e.match(/\d/g);
                        const o = r.join('');
                        const i = this.h(o);
                        i ? this.i(i, n) : n(this.j());
                    }
                }
                return (
                    (n.prototype.h = function (t) {
                        if (t.length === 7) return t;
                    }),
                    (n.prototype.j = function (t, n, e, r, o) {
                        return void 0 === t && (t = ''), void 0 === n && (n = ''), void 0 === e && (e = ''), void 0 === r && (r = ''), void 0 === o && (o = ''), { k: t, region: n, l: e, m: r, o };
                    }),
                    (n.prototype.p = function (t) {
                        return t && t[0] && t[1] ? this.j(t[0], this.g[t[0]], t[1], t[2], t[3]) : this.j();
                    }),
                    (n.prototype.q = function (t, n) {
                        window.$yubin = function (t) {
                            return n(t);
                        };
                        const e = document.createElement('script');
                        e.setAttribute('type', 'text/javascript'), e.setAttribute('charset', 'UTF-8'), e.setAttribute('src', t), document.head.appendChild(e);
                    }),
                    (n.prototype.i = function (n, e) {
                        const r = this;
                        const o = n.substr(0, 3);
                        return o in t && n in t[o]
                            ? e(this.p(t[o][n]))
                            : void this.q(this.URL + '/' + o + '.js', function (i) {
                                return (t[o] = i), e(r.p(i[n]));
                            });
                    }),
                    n
                );
            })();
            YubinBango.Core = n;
        })(YubinBango || (YubinBango = {}));
        const n = ['Japan', 'JP', 'JPN', 'JAPAN'];
        const e = ['p-region-id', 'p-region', 'p-locality', 'p-street-address', 'p-extended-address'];
        var YubinBango;
        !(function (YubinBango) {
            const t = (function () {
                function t() {
                    this.s();
                }
                return (
                    (t.prototype.s = function () {
                        const n = this;
                        const e = document.querySelectorAll('.h-adr');
                        [].map.call(e, function (e) {
                            if (n.t(e)) {
                                const r = e.querySelectorAll('.p-postal-code');
                                r[r.length - 1].addEventListener(
                                    'keyup',
                                    function (e) {
                                        t.prototype.u(n.v(e.target.parentNode));
                                    },
                                    !1,
                                );
                            }
                        });
                    }),
                    (t.prototype.v = function (t) {
                        return t.tagName === 'FORM' || t.classList.contains('h-adr') ? t : this.v(t.parentNode);
                    }),
                    (t.prototype.t = function (t) {
                        const e = t.querySelector('.p-country-name');
                        const r = [e.innerHTML, e.value];
                        return r.some(function (t) {
                            return n.indexOf(t) >= 0;
                        });
                    }),
                    (t.prototype.u = function (t) {
                        const n = this;
                        const e = t.querySelectorAll('.p-postal-code');
                        new YubinBango.Core(this.A(e), function (e) {
                            return n.B(t, e);
                        });
                    }),
                    (t.prototype.A = function (t) {
                        return [].map
                            .call(t, function (t) {
                                return t.value;
                            })
                            .reduce(function (t, n) {
                                return t + n;
                            });
                    }),
                    (t.prototype.B = function (t, n) {
                        const r = [this.C, this.D];
                        r.map(function (r) {
                            return e.map(function (e) {
                                return r(e, t, n);
                            });
                        });
                    }),
                    (t.prototype.C = function (t, n, e) {
                        if (e) {
                            const r = n.querySelectorAll('.' + t);
                            [].map.call(r, function (t) {
                                return (t.value = '');
                            });
                        }
                    }),
                    (t.prototype.D = function (t, n, e) {
                        const r = { 'p-region-id': e.k, 'p-region': e.region, 'p-locality': e.l, 'p-street-address': e.m, 'p-extended-address': e.o };
                        const o = n.querySelectorAll('.' + t);
                        [].map.call(o, function (n) {
                            return (n.value += r[t] ? r[t] : '');
                        });
                    }),
                    t
                );
            })();
            YubinBango.MicroformatDom = t;
        })(YubinBango || (YubinBango = {})),
        new YubinBango.MicroformatDom();
    }
}

FormValidator = new FormValidator();