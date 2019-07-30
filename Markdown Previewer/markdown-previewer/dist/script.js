marked.setOptions({ gfm: true, breaks: true });

// document.getElementById('preview').innerHTML = 
//     marked(document.getElementById('editor').innerHTML);

$("#preview").html(marked($("#editor").val()));

$("#editor").keyup(function () {
  // alert("on change");
  var input = $("#editor").val();
  marked.setOptions({ gfm: true, breaks: true });
  // document.getElementById('preview').innerHTML =
  //     marked(input);
  $("#preview").html(marked(input));
});