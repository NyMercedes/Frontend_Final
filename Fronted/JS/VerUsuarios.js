$(document).ready(function () {
    $.ajax({
      url: "http://localhost:5002/usuario/TodosUsuarios",
      method: "GET",
      dataType: "json",