(window.webpackJsonp=window.webpackJsonp||[]).push([[126],{829:function(s,t,n){"use strict";n.r(t);var a=n(1),e=Object(a.a)({},(function(){var s=this,t=s.$createElement,n=s._self._c||t;return n("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[n("h2",{attrs:{id:"_1-使用-input-进行输入"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_1-使用-input-进行输入"}},[s._v("#")]),s._v(" 1. 使用 "),n("code",[s._v("input()")]),s._v(" 进行输入")]),s._v(" "),n("p",[s._v("Python3 使用 "),n("code",[s._v("input()")]),s._v(" 函数获取用户输入。")]),s._v(" "),n("p",[n("code",[s._v("input()")]),s._v(" 函数会返回一个字符串，随后可以使用 "),n("code",[s._v("int()")]),s._v(" "),n("code",[s._v("float()")]),s._v(" 等方法将字符串转为对应的类型或者格式")]),s._v(" "),n("blockquote",[n("p",[s._v("在 Python 3 中，"),n("code",[s._v("raw_input()")]),s._v(" 被整合到 "),n("code",[s._v("input()")]),s._v(" 函数中，Python 2 的 "),n("code",[s._v("input()")]),s._v(" 函数的功能被抛弃了。")])]),s._v(" "),n("h2",{attrs:{id:"_2-文件输入输出"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_2-文件输入输出"}},[s._v("#")]),s._v(" 2. 文件输入输出")]),s._v(" "),n("p",[s._v("与 C++ 和 Java 读取文件流的形式一样，Python 通过使用 "),n("code",[s._v("file")]),s._v(" 类的函数来对文件进行读取写入")]),s._v(" "),n("div",{staticClass:"language-python line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-python"}},[n("code",[s._v("poem "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token triple-quoted-string string"}},[s._v("'''\\ Programming is fun\nWhen the work is done\nif you wanna make your work also fun:\n    use Python!\n'''")]),s._v("\n\nf "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token builtin"}},[s._v("open")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v("'poem.txt'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[s._v("'w'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# open for 'w'riting")]),s._v("\nf"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("write"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("poem"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# write text to file")]),s._v("\nf"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("close"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# close the file")]),s._v("\nf "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token builtin"}},[s._v("open")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v("'poem.txt'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# if no mode is specified, 'r'ead mode is assumed by default")]),s._v("\n\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("while")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("True")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n    line "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" f"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("readline"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token builtin"}},[s._v("len")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("line"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("==")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Zero length indicates EOF")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("break")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("print")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("line"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" end"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v("''")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n\nf"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("close"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# close the file")]),s._v("\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br"),n("span",{staticClass:"line-number"},[s._v("8")]),n("br"),n("span",{staticClass:"line-number"},[s._v("9")]),n("br"),n("span",{staticClass:"line-number"},[s._v("10")]),n("br"),n("span",{staticClass:"line-number"},[s._v("11")]),n("br"),n("span",{staticClass:"line-number"},[s._v("12")]),n("br"),n("span",{staticClass:"line-number"},[s._v("13")]),n("br"),n("span",{staticClass:"line-number"},[s._v("14")]),n("br"),n("span",{staticClass:"line-number"},[s._v("15")]),n("br"),n("span",{staticClass:"line-number"},[s._v("16")]),n("br"),n("span",{staticClass:"line-number"},[s._v("17")]),n("br"),n("span",{staticClass:"line-number"},[s._v("18")]),n("br")])]),n("blockquote",[n("p",[s._v("使用 "),n("code",[s._v("open()")]),s._v(" 打开文件，模式规则和 C++ 的相同\n文件交互完毕后，使用 "),n("code",[s._v("close()")]),s._v(" 来关闭文件流")])]),s._v(" "),n("h2",{attrs:{id:"_3-pickle-模块"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_3-pickle-模块"}},[s._v("#")]),s._v(" 3. pickle 模块")]),s._v(" "),n("p",[s._v("Python 提供了一个 "),n("code",[s._v("pickle")]),s._v(" 的标准模块，用于将对象储存在文件中，称为对象的持久化保存")]),s._v(" "),n("div",{staticClass:"language-python line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-python"}},[n("code",[n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#!/usr/bin/python")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Filename: pickling.py")]),s._v("\n\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("import")]),s._v(" pickle\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# the name of the file where we will store the object")]),s._v("\nshoplistfile "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[s._v("'shoplist.data'")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# the list of things to buy")]),s._v("\nshoplist "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v("'apple'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v("'mango'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v("'carrot'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Write to the file")]),s._v("\nf "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token builtin"}},[s._v("open")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("shoplistfile"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v("'wb'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\npickle"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("dump"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("shoplist"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" f"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#dump the object to a file f.close()")]),s._v("\n\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("del")]),s._v(" shoplist "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# detroy the shoplist variable")]),s._v("\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Read back from the storage")]),s._v("\nf "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token builtin"}},[s._v("open")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("shoplistfile"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v("'rb'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\nstoredlist "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" pickle"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("load"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("f"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# load the object from the file")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("print")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("storedlist"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br"),n("span",{staticClass:"line-number"},[s._v("8")]),n("br"),n("span",{staticClass:"line-number"},[s._v("9")]),n("br"),n("span",{staticClass:"line-number"},[s._v("10")]),n("br"),n("span",{staticClass:"line-number"},[s._v("11")]),n("br"),n("span",{staticClass:"line-number"},[s._v("12")]),n("br"),n("span",{staticClass:"line-number"},[s._v("13")]),n("br"),n("span",{staticClass:"line-number"},[s._v("14")]),n("br"),n("span",{staticClass:"line-number"},[s._v("15")]),n("br"),n("span",{staticClass:"line-number"},[s._v("16")]),n("br"),n("span",{staticClass:"line-number"},[s._v("17")]),n("br"),n("span",{staticClass:"line-number"},[s._v("18")]),n("br"),n("span",{staticClass:"line-number"},[s._v("19")]),n("br"),n("span",{staticClass:"line-number"},[s._v("20")]),n("br")])]),n("blockquote",[n("p",[s._v("注意，持久化保存要求使用"),n("strong",[s._v("二进制模式")]),s._v("\n通过 "),n("code",[s._v("dump()")]),s._v(" 和 "),n("code",[s._v("load()")]),s._v(" 就可以对对象进行导入和导出")])])])}),[],!1,null,null,null);t.default=e.exports}}]);