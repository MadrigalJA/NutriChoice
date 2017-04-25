 let tags = ["African", "Chinese", "Japanese", "Korean", "Vietnamese", "Thai", "Indian", "British", "Irish", "French", "Italian", "Mexican", "Spanish", "Middle Eastern", "Jewish", "American", "Southern", "Greek", "German", "Caribbean", "Latin American", "Pescetarian", "Lacto ", "Vegetarian", "Ovo Vegetarian", "Vegan", "Paleo", "Primal", "Main Course", "Side Dish", "Dessert", "Appetizer", "Salad", "Bread", "Breakfast", "Soup", "Beverage", "Sauce", "Drink"];
 let nutrients = ["maxCalories", "maxCarbs", "maxFat", "maxProtein", "minCalories", "minCarbs", "minFat", "minProtein"]
// var mashapeKey = "V8LgO9xnyAmshdOH0OjtyW0rcpuWp1yLyd0jsn2AnxQDjbFR34";
// productionKey
var mashapeKey = "ip0pFVt0IamshZ8xUr0dhNQhBArmp12fdqdjsnmTBFoAipNjid";
//testKey
// var mashapeKey = "V8LgO9xnyAmshdOH0OjtyW0rcpuWp1yLyd0jsn2AnxQDjbFR34";
    function init()
    {
        buildRandomTab();

    }

    function buildRandomTab()
    {
        var div = document.getElementById("modTags");
        var tempElem;

        for (var i = 0; i < tags.length ; i++)
        {
            var stringElem = '<input id="' + tags[i] + '" type="checkbox">&#160;' + tags[i];
            tempElem = document.createElement("label");
            tempElem.setAttribute("class", "checkbox-inline no_indent col-lg-2 col-xs-6  col-md-4");
            tempElem.innerHTML = stringElem;
            div.appendChild(tempElem);
        }
    }

    function prepSearch()
    {
        var strActive = "active";
        var byIngClass = document.getElementById("byIngredientsTab").className;
        var byNutClass = document.getElementById("byNutrientsTab").className;
        var byRndClass = document.getElementById("randomTab").className;
        var handleFlag ;

        clearError("searchResultsError");

        var urlstr;

        if (byIngClass.includes(strActive))
        {
            urlstr = buildUrl("ING");
            handleFlag = 1;

        }
        else if (byNutClass.includes(strActive))
        {
            urlstr = buildUrl("NUT");
            handleFlag = 2;
        }
        else if (byRndClass.includes(strActive))
        {
            urlstr = buildUrl("RND");
            handleFlag = 3;
        }

        switch (handleFlag)
        {
            case 1:
            case 2:
                if (urlstr)
                {
                    //call api
                    loadSearch( urlstr)
                }
                break;
            case 3:
                    loadSearch(urlstr)
                break;
            default:
                //weird error major foobar
        }
    }


    function buildUrl(searchBy)
    {
        var url, urlold;

        switch (searchBy)
        {
            case "ING":
                var ingredients = document.getElementById("ingredientsText").value;
                url = urlold = "findByIngredients?fillIngredients=false&limitLicense=false&number=5&ranking=1&ingredients=";

                if (ingredients.match(/^(\s*[\w-]+\s*,?)+$/))
                {
                    ingredients = ingredients.replace(/\s*,\s*/, "%2C");
                    ingredients = ingredients.replace(/\n*/, "%2C");

                    url += ingredients;
                    clearError("ingredientsError");
                }
                else
                {
                    displayError("ingredientsError", "Must contain at least one ingredient and only include hyphens and commas.");
                    url = false;
                }

                break;

            case "RND":
                var tagStr = "";
                url = urlold = "random?limitLicense=false&number=4";


                for (var i = 0; i < tags.length ; i++)
                {
                    if (document.getElementById(tags[i]).checked)
                    {
                        tagStr += tags[i].toLowerCase() + "%2C";
                    }
                }
                if (tagStr != "")
                {
                    url += ("&tags=" + tagStr);
                }
                break;

            case "NUT":
                var nutrientStr = "";
                url = urlold = "findByNutrients?number=10&offset=0&random=false";

                for (var i = 0; i < nutrients.length ; i++)
                {
                    var tempval = document.getElementById(nutrients[i]).value;
                    if (tempval != "" && tempval.match(/\d+/))
                    {
                        nutrientStr += "&" + nutrients[i] + "=" + tempval;
                    }
                }

                if (nutrientStr != "")
                {
                    url += nutrientStr;
                    clearError("nutrientsError");
                }
                else
                {
                    url = false;
                    displayError("nutrientsError", "Must include at least one constraint.");
                }
                break;

            default:
                url = false;
        }

        return url;
    }


    function loadSearch( urlExtension)
    {
        var field = document.getElementById("searchBar");
        let baseUrl = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/";
        var xhttp = new XMLHttpRequest();
        var url = baseUrl + urlExtension;
        xhttp.onload = function(){
            receiveRecipe(this);
        };
        xhttp.open("GET", url, true);
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.setRequestHeader("X-Mashape-Key",mashapeKey);
        xhttp.send();
    }

    function receiveRecipe(xhttp)
    {
        var recipes = {};

        if (xhttp.readyState == 4 && xhttp.status == 200)
        {
            searchResults = JSON.parse(xhttp.responseText);
            if (searchResults.hasOwnProperty("recipes"))
            {
                if (searchResults.recipes.length != 0)
                {
                    displayResults(searchResults.recipes);
                }
                else
                {
                    displayError("searchResultsError", "No Results Found");
                    clearSearch();
                }
            }
            else
            {
                if (searchResults.length > 0)
                {
                    displayResults(searchResults);
                }
                else
                {
                    displayError("searchResultsError", "No Results Found");
                    clearSearch();
                }
            }
        }
        else
        {
            displayError("searchResultsError", "No Results Found.");
            clearSearch();
        }
    }

    function displayResults(recipes)
    {
        var resultsSection = document.getElementById("resultsSection");
        var recipeBlock, recipeLink, recipeImg, caption, captionDiv;
        resultsSection.innerHTML = "";

        displayError("resultsHeader", "Search Results:");

        for(var i = 0 ; i < recipes.length ; i++)
        {
          recipeImg = document.createElement("img");
          recipeImg.setAttribute("padding", "auto");
          recipeImg.src = recipes[i].image;
          recipeImg.alt = "image";

          caption = document.createElement("p");
          caption.innerHTML = recipes[i].title;

          captionDiv = document.createElement("div");
          captionDiv.appendChild(recipeImg);
          captionDiv.appendChild(caption);

          recipeLink = document.createElement("a");
          recipeLink.setAttribute("href","RecipePage/recipePage.html");
          recipeLink.addEventListener("click",function(){
              navToRecipe(this.id);
          },false);
          recipeLink.id = recipes[i].id;
          recipeLink.appendChild(captionDiv);

          recipeBlock = document.createElement("div");
          recipeBlock.setAttribute("id","matchedRecipes");
          recipeBlock.appendChild(recipeLink);

          resultsSection.appendChild(recipeBlock);
        }
    }

    function displayError(elementID, errorMsg)
    {
        errorElem = document.getElementById(elementID);
        errorElem.innerHTML = errorMsg;
    }

    function clearError(elementID)
    {
        errorElem = document.getElementById(elementID);
        errorElem.innerHTML = "";
    }

    function clearSearch()
    {
        var resultsSection = document.getElementById("resultsSection");
        while (resultsSection.hasChildNodes())
        {
            resultsSection.removeChild(resultsSection.lastChild);
        }
    }

    function navToRecipe(recipeID)
    {
        //passing the recipe ID to the recipePage
        localStorage.setItem("recipeId",recipeID);
    }

window.addEventListener("load", init, false);
