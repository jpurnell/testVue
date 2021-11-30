/*
 * 参考以下作者的代码，做了少许修改
 * html2json By Jxck
 * https://github.com/Jxck/html2json
 * HTML5 Parser By Sam Blowes
 * Designed for HTML5 documents
 * Original code by John Resig (ejohn.org)
 * http://ejohn.org/blog/pure-javascript-html-parser/
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 *
 */

const startTag = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/
const endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/
const attr = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g
const empty = makeMap('area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr')
const block = makeMap('a,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video')
const inline = makeMap('abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var')
const closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr')
const fillAttrs = makeMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected')
const special = makeMap('script,style')
let results = {
  node: 'root',
  child: []
}
let bufArray = []
const handler = {
  start: function (tag, attrs, unary) {
    var node = {
      node: 'element',
      tag: tag
    }
    if (attrs.length !== 0) {
      node.attr = attrs.reduce((pre, attr) => {
        var name = attr.name
        var value = attr.value

        /*
        if (value.match(/ /)) {
          value = value.split(' ')
        }
        */

        // if attr already exists
        // merge it
        if (pre[name]) {
          if (Array.isArray(pre[name])) {
            // already array, push to last
            pre[name].push(value)
          } else {
            // single value, make it array
            pre[name] = [pre[name], value]
          }
        } else {
          // not exist, put it
          pre[name] = value
        }

        return pre
      }, {})
    }
    if (unary) {
      // if this tag dosen't have end tag
      // like <img src="hoge.png"/>
      // add to parents
      var parent = bufArray[0] || results
      if (parent.child === undefined) {
        parent.child = []
      }
      parent.child.push(node)
    } else {
      bufArray.unshift(node)
    }
  },
  end: function (tag) {
    var node = bufArray.shift()
    if (node.tag !== tag) console.error('invalid state: mismatch end tag')

    if (bufArray.length === 0) {
      results.child.push(node)
    } else {
      var parent = bufArray[0]
      if (parent.child === undefined) {
        parent.child = []
      }
      parent.child.push(node)
    }
  },
  chars: function (text) {
    if (bufArray.length === 0) {
      results.child.text = text
    } else {
      var parent = bufArray[0]
      if (parent.text === undefined) {
        parent.text = text
      } else {
        parent.text = parent.text + text
      }
    }
  },
  comment: function (text) {
    var node = {
      node: 'comment',
      text: text
    }
    var parent = bufArray[0]
    if (parent.child === undefined) {
      parent.child = []
    }
    parent.child.push(node)
  }
}
let match = []
let stack = []
stack.last = function () {
  return this[this.length - 1]
}

function removeDOCTYPE (html) {
  return html
    .replace(/<\?xml.*\?>\n/, '')
    .replace(/<!doctype.*\/>\n/, '')
    .replace(/<!DOCTYPE.*\/>\n/, '')
    .replace(/[\\\n\r]/g, '')
}

function htmlParser (html) {
  let index = []
  let chars = false
  let last = html

  while (html) {
    chars = true

    if (!stack.last() || !special[stack.last()]) {
      // Comment
      if (html.indexOf('<!--') === 0) {
        index = html.indexOf('-->')

        if (index >= 0) {
          if (handler.comment) {
            handler.comment(html.substring(4, index))
          }
          html = html.substring(index + 3)
          chars = false
        }

        // end tag
      } else if (html.indexOf('</') === 0) {
        match = html.match(endTag)

        if (match) {
          html = html.substring(match[0].length)
          match[0].replace(endTag, parseEndTag)
          chars = false
        }

        // start tag
      } else if (html.indexOf('<') === 0) {
        match = html.match(startTag)

        if (match) {
          html = html.substring(match[0].length)
          match[0].replace(startTag, parseStartTag)
          chars = false
        }
      }

      if (chars) {
        index = html.indexOf('<')

        let text = index < 0 ? html : html.substring(0, index)
        html = index < 0 ? '' : html.substring(index)

        if (handler.chars) {
          if (text.replace(/\s/g, '').length > 0) {
            handler.chars(text)
          }
        }
      }
    } else {
      html = html.replace(new RegExp('([\\s\\S]*?)</' + stack.last() + '[^>]*>'), (all, text) => {
        text = text.replace(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g, '$1$2')
        if (handler.chars) {
          if (text.replace(/\s/g, '').length > 0) {
            handler.chars(text)
          }
        }
        return ''
      })

      parseEndTag('', stack.last())
    }

    if (html === last) {
      throw new Error('Parse Error: ' + html)
    }
    last = html
  }

  // Clean up any remaining tags
  // parseEndTag()
}

function parseStartTag (tag, tagName, rest, unary) {
  tagName = tagName.toLowerCase()

  if (block[tagName]) {
    while (stack.last() && inline[stack.last()]) {
      parseEndTag('', stack.last())
    }
  }

  if (closeSelf[tagName] && stack.last() === tagName) {
    parseEndTag('', tagName)
  }

  unary = empty[tagName] || !!unary

  if (!unary) {
    stack.push(tagName)
  }

  if (handler.start) {
    let attrs = []

    rest.replace(attr, (match, name) => {
      let reg = /"(.*?)"/
      var value = fillAttrs[name] ? name : reg.exec(match)
      if (value instanceof Array) {
        value = value[1]
      }
      attrs.push({
        name: name,
        value: value,
        escaped: '' // value.replace(/(^|[^\\])"/g, '$1\\"')
      })
    })

    handler.start(tagName, attrs, unary)
  }
}

function parseEndTag (tag, tagName) {
  let pos = 0
  if (!tagName) {
    pos = 0
  } else {
    for (pos = stack.length - 1; pos >= 0; pos--) {
      if (stack[pos] === tagName) {
        break
      }
    }
  }
  if (pos >= 0) {
    for (var i = stack.length - 1; i >= pos; i--) {
      if (handler.end) {
        handler.end(stack[i])
      }
    }
    stack.length = pos
  }
}

function makeMap (str) {
  var obj = {}, items = str.split(',')
  for (var i = 0; i < items.length; i++) {
    obj[items[i]] = true
  }
  return obj
}

function html2json (val) {
  let html = removeDOCTYPE(val)
  results.child = []
  htmlParser(html)
  return results
}

export default html2json
