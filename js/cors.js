function CORSSolve(){
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function(){
      if (this.readyState == 4 && this.status == 200){
        document.getElementById('data').innerText = xhttp.responseText
      }
    }
    xhttp.open("GET","https://cors-anywhere.herokuapp.com/https://tiny-news-api.herokuapp.com/api/news",true)
    xhttp.send()
  }
  
  CORSSolve ()