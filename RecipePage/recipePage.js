
var baseUrl = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/";
// var mashapeKey = "e8s6cVRETtmshWTqUuIYdAeZYHazp1zHCsHjsnM82ZzegfypEW";
var mashapeKey = "V8LgO9xnyAmshdOH0OjtyW0rcpuWp1yLyd0jsn2AnxQDjbFR34";
// var mashapeKey = "QyYLmeGDxXmsh8uWFbcJJW7whlyLp1KWaRYjsnKiVPTys0JeZF";
var recipeId = 600365;
// var recipeId = 456;

function start() {
  getRecipe();
}

function getRecipe() {
  try {
    var searchUrl = baseUrl + "recipes/"+ recipeId +"/information?includeNutrition=true";
    var recipeRequest = new XMLHttpRequest();
    recipeRequest.addEventListener("readystatechange",function() { displayRecipeInfo(recipeRequest); },false);
    recipeRequest.open("GET",searchUrl,true);
    recipeRequest.setRequestHeader("accept","application/json;charset=utf-8");
    // recipeRequest.setRequestHeader("X-Mashape-Key","QyYLmeGDxXmsh8uWFbcJJW7whlyLp1KWaRYjsnKiVPTys0JeZF");
    recipeRequest.setRequestHeader("X-Mashape-Key", mashapeKey);
    recipeRequest.send();
  }
catch (e) {
  alert("Oops! Something went wrong with the request");
  }
}

function displayRecipeInfo(recipeRequest) {
console.log("request sent");
if(recipeRequest.readyState == 4 && recipeRequest.status == 200) {
  var data = JSON.parse(recipeRequest.responseText);

  document.getElementById("recipeTitle").innerHTML = data.title;
  document.getElementById("recipeImg").src = data.image;
  document.getElementById("calorieInfo").innerHTML = data.nutrition.nutrients[0].amount + data.nutrition.nutrients[0].title;
  document.getElementById("recipeTime").innerHTML = data.readyInMinutes + "minutes";
  document.getElementById("servingSize").innerHTML = data.servings;
  document.getElementById("recipeSource").innerHTML = data.sourceName;
  document.getElementById("vegCheck").innerHTML = data.vegetarian == true ? "Yes" : "No";
  document.getElementById("glutenCheck").innerHTML = data.glutenFree == true ? "Yes" : "No";
  document.getElementById("dairyCheck").innerHTML = data.dairyFree == true ? "Yes" : "No";

  var ingredientsList = document.createElement("ul");
  for(var i=0; i < data.extendedIngredients.length; i++) {
    var ingredientsName = document.createElement("li");
    ingredientsName.innerHTML = data.extendedIngredients[i].originalString;
    ingredientsList.appendChild(ingredientsName);
  }
  var ingredientsEle = document.getElementById("reqIngredients");
  while (ingredientsEle.hasChildNodes()) {
    ingredientsEle.removeChild(ingredientsEle.lastChild);
  }
  document.getElementById("reqIngredients").appendChild(ingredientsList);

  var recipeInstructionsEle = document.createElement("div");
  recipeInstructionsEle.setAttribute("id","recipeInstructions");
  recipeInstructionsEle.setAttribute("class", "recipeInstructions");

  var analyzedInstructions = document.createElement("ol");
  if(data.analyzedInstructions.length) {
    for(var i=0; i < data.analyzedInstructions[0].steps.length; i++) {
      var step = document.createElement("li");
      step.innerHTML = data.analyzedInstructions[0].steps[i].step;
      analyzedInstructions.appendChild(step);
    }
  }
  else {
      analyzedInstructions.innerHTML = "Sorry. No Instruction available for this recipe";
  }
  var InstructionsEle = document.getElementById("recipeInfo");
  if(InstructionsEle.children.length > 2 )
      InstructionsEle.removeChild(InstructionsEle.children[2]);
  recipeInstructionsEle.appendChild(analyzedInstructions);
  document.getElementById("recipeInfo").appendChild(recipeInstructionsEle);
  // var hr = document.createElement("hr");
  // document.getElementById("recipeInfo").appendChild(hr);
  getRelatedRecipes();
  }
}

function getRelatedRecipes() {

  try {
    var searchUrl = baseUrl + "recipes/"+ recipeId +"/similar";
    var similarRecipeRequest = new XMLHttpRequest();
    similarRecipeRequest.addEventListener("readystatechange",function() { displayRelatedRecipes(similarRecipeRequest); },false);
    similarRecipeRequest.open("GET",searchUrl,true);
    similarRecipeRequest.setRequestHeader("accept","application/json;charset=utf-8");
    // recipeRequest.setRequestHeader("X-Mashape-Key","QyYLmeGDxXmsh8uWFbcJJW7whlyLp1KWaRYjsnKiVPTys0JeZF");
    similarRecipeRequest.setRequestHeader("X-Mashape-Key", mashapeKey);
    similarRecipeRequest.send();
  }
catch (e) {
  alert("Oops! Something went wrong with the request");
  }
}

function displayRelatedRecipes(similarRecipeRequest) {
  if(similarRecipeRequest.readyState == 4 && similarRecipeRequest.status == 200) {
    var data = JSON.parse(similarRecipeRequest.responseText);

    var relatedElements = document.getElementById("relatedRecipies");
    while (relatedElements.hasChildNodes()) {
      relatedElements.removeChild(relatedElements.lastChild);
    }


    for(var i=0;i < data.length;i++) {
      var rel = document.createElement("div");
      var relatedRecipeBlock = document.createElement("a");
      relatedRecipeBlock.setAttribute("href","#");
      relatedRecipeBlock.addEventListener("click",loadNewRecipe,false);
      relatedRecipeBlock.id = data[i].id;
      var info = document.createElement("div");
      var img = document.createElement("img");
      img.src = "https://spoonacular.com/recipeImages/" + data[i].imageUrls[0];
      img.alt = "image";
      var title = document.createElement("p");
      // title.innerHTML = "Recipe Title which might be very long. It might evenexceed this page";
      title.innerHTML = data[i].title;
      info.appendChild(img);
      info.appendChild(title);
      relatedRecipeBlock.appendChild(info);
      rel.appendChild(relatedRecipeBlock);
      document.getElementById("relatedRecipies").appendChild(rel);
    }
  }
}
function loadNewRecipe(e) {
  recipeId = e.currentTarget.getAttribute("id");
  console.log(recipeId);
  start();

}
function displayRelatedRecipesDummy() {
  for(var i=0;i<10;i++) {
    var rel = document.createElement("div");
    var relatedRecipeBlock = document.createElement("a");
    relatedRecipeBlock.setAttribute("href","#");
    var info = document.createElement("div");
    var img = document.createElement("img");
    img.src = "images/java.jpg";
    img.alt = "image";
    var title = document.createElement("p");
    title.innerHTML = "Recipe Title which might be very long. It might evenexceed this page";
    info.appendChild(img);
    info.appendChild(title);
    relatedRecipeBlock.appendChild(info);
    rel.appendChild(relatedRecipeBlock);
    document.getElementById("relatedRecipies").appendChild(rel);
  }
}
window.addEventListener("load",start,false);
// window.addEventListener("load",displayRelatedRecipesDummy,false);
