/*jshint esnext: true */


const container = document.querySelector('.container');

container.addEventListener('click', function() {
	
	let first = 'opening';
    let second = 'open';
    
    if(this.classList.contains(first)) {
      [first, second] = [second, first];
    }
    this.classList.toggle(first);
    setTimeout(() => {
	    console.log(this);
      this.classList.toggle(second);
      }, 1000);
});

var username = $("input#username").val();
var password = $("input#password").val();  

function make_base_auth(user, password) {
  var tok = user + ':' + password;
  var hash = Base64.encode(tok);
  return "Basic " + hash;
}
$.ajax
  ({
    type: "GET",
    url: "index1.php",
    dataType: 'json',
    async: false,
    data: '{"username": "' + username + '", "password" : "' + password + '"}',
    success: function (){
    alert('Thanks for your comment!'); 
    }
});