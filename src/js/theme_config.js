let theme

function setTheme(t) {
  document.cookie = "theme="+t
}

function getTheme() {

  let ca = document.cookie.split(";")
  let name = "theme" + "="
  for(let i=0; i < ca.length; i++)
  {
    let c = ca[i].trim();
    if (c.indexOf(name)==0)
      theme = c.substring(name.length,c.length);
  }
  if(theme===undefined){
    theme = "winter"
  }
  return theme
}
