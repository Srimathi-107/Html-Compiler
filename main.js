function updlinenum(txtid, lineid) {
  let number = "";
  let find_len = txtid.value.split("\n").length;
  for (let i = 1; i <= find_len; i++) {
    number += i + "<br>";
  }
  lineid.innerHTML = number;
}
function scrolll(txtid, lineid) {
  lineid.scrollTop = txtid.scrollTop;
}

function editorKeydown(txtid, e) {
  let pos = txtid.selectionStart;
  if (e.key === "Tab") {
    e.preventDefault();
    let before = txtid.value.substring(0, pos);
    let after = txtid.value.substring(pos);
    txtid.value = before + "  " + after;
    txtid.selectionStart = txtid.selectionEnd = pos + 2;
  } else if (e.key === "Enter") {
    e.preventDefault();
    let before = txtid.value.substring(0, pos);
    let after = txtid.value.substring(pos);
    let currentline = before.split("\n").pop();
    let space = currentline.match(/^\s*/)[0];
    if (currentline.trim().endsWith(">") || currentline.trim().endsWith("{")) {
      space += "  ";
    }
    if (
      currentline.trim().startsWith("</") ||
      currentline.trim().endsWith("}")
    ) {
      space = space.substring(0, Math.max(0, space.length - 2));
    }
    txtid.value = before + "\n" + space + after;
    txtid.selectionStart = txtid.selectionEnd = pos + 1 + space.length;
  } else if (e.key === "/" || e.key === "}") {
    let before = txtid.value.substring(0, pos);
    let currentline = before.split("\n").pop();
    let space = currentline.match(/^\s*/)[0];
    let html = e.key === "/" && before.endsWith("<");
    let cssrjs = e.key === "}";
    if ((html || cssrjs) && space.length >= 2) {
      let line = pos - currentline.length;
      txtid.value =
        txtid.value.substring(0, line) +
        currentline.substring(2) +
        txtid.value.substring(pos);
      txtid.selectionStart = txtid.selectionEnd = pos - 2;
    }
  }
  updlinenum(html, htmlnum);
  updlinenum(css, cssnum);
  updlinenum(js, jsnum);
}

function autoclosebracket(txtid, e) {
  let pos = txtid.selectionStart;
  let before = txtid.value.substring(0, pos);
  let after = txtid.value.substring(pos);
  if (e.key === "{") {
    e.preventDefault();
    txtid.value = before + "{\n  \n}" + after;
    txtid.selectionStart = txtid.selectionEnd = pos + 4;
  }
  if (e.key === "(") {
    e.preventDefault();
    txtid.value = before + `()` + after;
    txtid.selectionStart = txtid.selectionEnd = pos + 1;
  }
  if (e.key === ">") {
    let match = before.match(/<([a-zA-Z][A-Za-z0-9]*)$/);
    // console.log(match);
    if (match) {
      e.preventDefault();
      let tagname = match[1];
      txtid.value = before + "></" + tagname + ">" + after;
      txtid.selectionStart = txtid.selectionEnd = pos + 1;
    }
  }
}


function savecodelocalstrge() {
  let htmlcode = document.getElementById("html").value;
  let csscode = document.getElementById("css").value;
  let jscode = document.getElementById("js").value;
  localStorage.setItem("Html code", htmlcode);
  localStorage.setItem("css code", csscode);
  localStorage.setItem("js code", jscode);
}
function loaddatafromlocalstrg() {
  let savehtml = localStorage.getItem("Html code");
  let savecss = localStorage.getItem("css code");
  let savejs = localStorage.getItem("js code");
  html.value = savehtml || "";
  css.value = savecss || "";
  js.value = savejs || "";
  updlinenum(html, htmlnum);
  updlinenum(css, cssnum);
  updlinenum(js, jsnum);
}
window.addEventListener("load", () => {
  loaddatafromlocalstrg();
});

function clearallvalue() {
  let confirmm = confirm("Are you sure want to delete ?"); //true-->false ; false-->true return
  // console.log(confirmm)
  if (!confirmm) {
    return;
  }

  localStorage.removeItem("Html code");
  localStorage.removeItem("css code");
  localStorage.removeItem("js code");

  html.value = "";
  css.value = "";
  js.value = "";

  out.contentDocument.body.innerHTML = "";

  updlinenum(html, htmlnum);
  updlinenum(css, cssnum);
  updlinenum(js, jsnum);
}

function copycode(txtid) {
  if (txtid.value === "") {
    return;
  }
  navigator.clipboard.writeText(txtid.value);
  // navigator.clipboard.writeText(txtid.value)
  // navigator.clipboard.writeText(txtid.value)
  // alert("code copied")
}

function undoo() {
  if (hisindex > 0) {
    hisindex--;
    let data = history[hisindex];
    html.value = data.html;
    css.value = data.css;
    js.value = data.js;
    updlinenum(html, htmlnum);
    // updlinenum(html,htmlnum)
    updlinenum(css, cssnum);
    updlinenum(js, jsnum);
    run();
  }
}
function redoo() {
  if (hisindex < history.length - 1) {
    hisindex++;
    let data = history[hisindex];
    ((html.value = data.html), (css.value = data.css), (js.value = data.js));
    updlinenum(html, htmlnum);
    updlinenum(css, cssnum);
    updlinenum(js, jsnum);
    run();
  }
}
function searchcode() {
  let search = document.getElementById("search");
  let searchtxt = search.value;
  let res = document.getElementById("res");
  if (searchtxt === "") {
    res.innerHTML = "";
    return;
  }
  let htmlcount = count(html.value, searchtxt);
  let csscount = count(css.value, searchtxt);
  let jscount = count(js.value, searchtxt);
  let tot = htmlcount + csscount + jscount;
  res.innerHTML = `Found : ${tot}`;
}
function count(txtvalue, searchtxt) {
  let c = 0,
    pos = 0;
  while ((pos = txtvalue.indexOf(searchtxt, pos)) !== -1) {
    c++;
    pos += searchtxt.length;
  }
  return c;
}
let save;
function autosave() {
  clearTimeout(save);
  save = setTimeout(() => {
    savecodelocalstrge();
  }, 5000);
}
function run() {
  try {
    out.contentDocument.body.innerHTML =
      html.value + "<style>" + css.value + "</style>";
    out.contentWindow.eval(js.value);
  } catch (e) {
    out.contentDocument.body.innerHTML = `<div style=";padding:10px;color: white;background-color: rgba(255, 0, 0, 0.742);font-weight: 700;font-style: initial;">
            Error : ${e.message}  
          </div>`;
  }
  // console.log()
  updlinenum(html, htmlnum);
  updlinenum(css, cssnum);
  updlinenum(js, jsnum);
  //or iframe.srcDoc=html.value and scritp ans style tag create pani append panro iframe head and body kula

  // let i=out.contentDocument || out.contentWindow.document
  // i.open()
  // i.write(html)
  // i.close()

  // let style=i.createElement("style")
  // style.innerHTML=css
  // i.head.append(style)
  // let script=i.createElement("script")
  // script.innerHTML=js
  // i.body.append(script)
}
