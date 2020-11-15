
$(document).ready(function () {
    init();
    addNewIngredient();
    addNewRecipe();

    $(document).on("click", "#creIngredient", createIngredient);
    $(document).on("click", ".close_btn", function () {
        $("#simpleForm").css("display", "none");
    })
    $(document).on("click", "#createRecepie", createRecipe);
    $(document).on("change", "#VideoCheckbox", function () {
        $('#VideoDiv').toggle();
    })
    $(".search_icon").click(function () {
        $("#SearchRec").val('');
        $("#Dishes").html("");
        $("#dishes_c").show();
    })

    var myform = $("form#myform");
    myform.submit(function (event) {
        event.preventDefault();
        // Change to your service ID, or keep using the default service
        var service_id = "service_bre05cx";
        var template_id = "template_h20c6y8";

        myform.find("button").text("sending..");
        emailjs.sendForm(service_id, template_id, "myform")
            .then(function () {
                alert("Your request was sent!");
                $("#newsMail").val("");
                myform.find("button").text("Sign me up");
            }, function (err) {
                    alert("Error!\r\n Response:\n " + JSON.stringify(err));
                    $("#newsMail").val("");
                    myform.find("button").text("Sign me up");                
            });
        return false;       
    })
})
    
counter = 4;
ingredientJson = [];
Recipes = [];
str = "";
total_c = 0;
ingInRec = [];
writtenRec = [];
videoRec = [];

//add new Ingredient open div
function addNewIngredient() {
    $("#addNewIngredient").click(function () {
        $("#SearchRec").val('');
        $('#Dishes').hide();
        $("#simpleForm").css("display", "block");
        $("#simpleForm").html(lblIngredient());
    });
}

//add new recipe open div
function addNewRecipe() {
    $("#addNewRecipe").click(function () {
        $("#SearchRec").val('');
        $('#Dishes').hide();
        $("#simpleForm").css("display", "block");
        $("#simpleForm").html(lblRecipe());
    });
}

class Ingredient {
    constructor(id, name, image, calories) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.calories = calories
    }

    get Id() { return this.id }
    get Name() { return this.name }
    get Image() { return this.image }
    get Calories() { return this.calories }

    Render = () => {
        str = "<div class='ing' id='" + this.Id + "'>";
        str += "<p><u>Ingredient Details:</u></p> ";
        str += "<img src='" + this.Image + "'</><br /> ";
        str += "<span><b>" + this.Name + "</span></b> <br />";
        str += "<span>Calories: " + this.Calories + "</span> </div>";
        return str
    }
 }

//print lables for Ingredient
lblIngredient = () => {
    str = "<label for='IngredientName'>Ingredient name: </label><br><input type='text' id='IngredientName'><br /><br />"
    str += "<label for= 'IngredientImage'> Ingredient Image(url): </label > <br><input type='text' id='IngredientImage'><br /><br />"
    str += "<label for='IngredientCalories'>Ingredient Calories: </label><br><input type='text' id='IngredientCalories'><br /><br />"
    str += "<button class='btn btn-one myButton' id='creIngredient'>Create Ingredient</button> <button class='btn btn-one myButton close_btn'>Close</button><hr>"
    return str;
}

// create Ingredient from input text and add to array
createIngredient = () => {
    IngredientName = $('#IngredientName').val()
    IngredientImage = $('#IngredientImage').val()
    IngredientCalories = parseInt($('#IngredientCalories').val())

    obj = new Ingredient(counter, IngredientName, IngredientImage, IngredientCalories)

    counter++;
    ingredientJson.push(obj);

    localStorage.setItem("ingredientJson", JSON.stringify(ingredientJson));
    localStorage.setItem("counter", JSON.stringify(counter));

    console.log(localStorage);
    document.getElementById("simpleForm").innerHTML = "<div class='alert alert-success'> your ingredient was added successfully</div>";
    
    $("input").val = "";
}


//initialize ingredients and recipes
init = () => {
    if (localStorage.getItem("ingredientJson") !== 'undefined' && localStorage.getItem("ingredientJson") !== null) {
        ingFromJSON = JSON.parse(localStorage.getItem("ingredientJson"));
        counter = JSON.parse(localStorage.getItem("counter"));

        for (var i = 0; i < ingFromJSON.length; i++) {
            ing = new Ingredient(ingFromJSON[i].id, ingFromJSON[i].name, ingFromJSON[i].image, ingFromJSON[i].calories);
            ingredientJson.push(ing);
        }
    }
    else {
        ingredientJson = [];
        obj1 = new Ingredient(0, "Chocolate", "https://vaya.in/recipes/wp-content/uploads/2018/02/Milk-Chocolate-1.jpg", 545)
        obj2 = new Ingredient(1, "Flour", "https://nuts.com/images/rackcdn/ed910ae2d60f0d25bcb8-80550f96b5feb12604f4f720bfefb46d.ssl.cf1.rackcdn.com/c08b4a59c098d141-tZqCb-IE-large.jpg", 364)
        obj3 = new Ingredient(2, "Eggs", "https://sc01.alicdn.com/kf/H4dd0fd55534a46adac6f618e58359fe4e.jpg_640x640.jpg", 78)
        obj4 = new Ingredient(3, "Sugar", "https://knightonfoods.com/images/interface/sugar.png", 387)

        ingredientJson.push(obj1, obj2, obj3, obj4);

    }
    if (localStorage.getItem("writtenRec") !== 'undefined' && localStorage.getItem("writtenRec") !== null && localStorage.getItem("videoRec") !== 'undefined' && localStorage.getItem("videoRec") !== null) {
        writtenRecFromJSON = JSON.parse(localStorage.getItem("writtenRec"));
        writtenRecFromJSON.forEach(function (item) {
            let w = new DishRecipe(item.name, item.ingredient, item.time, item.cookingMethod, item.image);
            Recipes.push(w);
        })
        videoRecFromJSON = JSON.parse(localStorage.getItem("videoRec"));
   
        videoRecFromJSON.forEach(function (item) {
            let v = new VideoRecipes(item.name, item.ingredient, item.time, item.cookingMethod, item.image, item.videoInstructions);
            Recipes.push(v);
        })

        Recipes.forEach(function (item) {   
            ingredients = [];
            item.ingredient.forEach(function (ing) {
                let i = new Ingredient(ing.id, ing.name, ing.image, ing.calories);
                ingredients.push(i);
            })
            item.ingredient = ingredients;
        })
    }
    else {
        Recipes = [];
        obj_rec1 = new DishRecipe("Lava cake", [ingredientJson[0], ingredientJson[1], ingredientJson[2], ingredientJson[3]], "25 min", "1.Prepare 4 ramekins. <br/> 2.Make the chocolate cake batter. <br/> 3.Spoon the batter evenly into each ramekin. <br/> 4.Bake <br/> 5.Invert the ramekins. <br/> 6.Add toppings & enjoy!  <br />", "https://img.mako.co.il/2013/10/31/Fondant_mako_c.jpg")

        obj_rec2 = new VideoRecipes("Cherry Chocolate Crackles", [ingredientJson[0], ingredientJson[1], ingredientJson[2]], "22 min", "1.Line a 12-hole muffin pan. <br/> 2.Place Copha in a small saucepan. <br/> 3.stir over a low heat until melted. <br/> 4.Combine all. <br/> 5 Remove bowl from heat. <br/> 5.Invert the ramekins. <br/> 6.Sprinkle with extra coconut & enjoy!  <br />", "https://i.ytimg.com/vi/6Vq-axbY6BA/maxresdefault.jpg", "https://www.youtube.com/embed/5UKxZFilE_A")

        obj_rec3 = new VideoRecipes("Chocolate Chip Cookies", [ingredientJson[1], ingredientJson[2], ingredientJson[3]], "40 min", "1.mix together the flour, salt, and baking soda. <br/> 2.Add the eggs and beat until light and fluffy. <br/> 3.Gradually add the flour mixture and beat to incorporate. <br/> 4.Fold in the chocolate chips until evenly distributed. <br/> 5. Remove bowl from heat. <br/> 6.Bake for 10–12 minutes or until golden & enjoy! <br />", "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRy1bO96McQ9kkCqqOhTyeNloqP9oL-trXCtQ&usqp=CAU", "https://www.youtube.com/embed/uJwekkbGPns")

        Recipes.push(obj_rec1, obj_rec2, obj_rec3);
    }
}

class DishRecipe {
    constructor(name, ingredient, time, cookingMethod, image) {
        this.name = name;
        this.ingredient = ingredient;
        this.time = time;
        this.cookingMethod = cookingMethod;
        this.image = image;
    }

    get Name() { return this.name }
    get Ingredient() { return this.ingredient }
    get Time() { return this.time }
    get CookingMethod() { return this.cookingMethod }
    get Image() { return this.image }

    Render1 = () => {
        str = "<h2> Recipe details: </h2> <p><i class='fa fa-star'></i>  <u>Dish name:</u> " + this.Name + "</p>";
        str += "<img src='" + this.Image + "'</>";
        str += "<br/><br/><p><i class='fa fa-cutlery'></i>  <u>Cooking method:</u> <br/>" + this.CookingMethod + "</p>";
        str += "<p><i class='fa fa-clock-o'></i>  <u>Total cooking time:</u> " + this.Time + "</p>";
        str += "<p><i class='fa fa-child'></i>  <u>Total calories:</u> " + this.getTotalCalories() + "</p>";
        //on click on recipe it takes the element with the id that has the name of the recipe and activate the modal
        str += "<a id='" + this.Name + "' class='btn btn-one myButton' data-toggle='modal' data-target='#bg-modal' onclick='showIngredients(this)'>Show ingredients</a>";

       let chk_exists = favorites_names.includes(this.Name)
        if (!chk_exists)
            str += "<a id='fav_" + this.Name + "' class='btn btn-one myButton fav' onclick = 'addToFavorites(this.id)' > <i class='fa fa-plus'></i> My favorites</a > ";
        else 
            str += "<a id='fav_" + this.Name + "' class='btn btn-one myButton fav' style='display: none' onclick = 'removeFromFavorites(this.id)' > <i class='fa fa-minus'></i> My favorites</a > ";
        
        return str
    }

    //total calories
    getTotalCalories = () => {

        let initialValue = 0;

        total_c = this.ingredient.reduce(function (accumulator, currentValue) { return accumulator + currentValue.calories }, initialValue)

        return total_c
    }

    //get all ingredients in a recipe
    getIngredients = () => {
        str = "";

        this.ingredient.forEach(item => { str += item.Render() })

        return str;
    }
}

class VideoRecipes extends DishRecipe {
    constructor(name, ingredient, time, cookingMethod, image, videoInstructions) {
        super(name, ingredient, time, cookingMethod, image);
        this.videoInstructions = videoInstructions;
    }

    Render2() {
        str = this.Render1();
        str += "<a id='" + this.videoInstructions + "' class='btn btn-one myButton vid' data-toggle='modal' data-target='#bg-modal' onclick='showVideo(this)'>Show video</a>";
        return str
    }
}

showVideo = (elm) => {
    //when to close the modal
    str = "<div class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></div>";
    //run the function that gets all the ingredients of a recipe
    str += "<iframe width='420' height='345' src='" + elm.id + "'></iframe >";

    //into the modal
    $("#cont").html(str);
}

//click on button show ingredients of a recipe
showIngredients = (elm) => {
    //get the index of the chosen recpie by the id that has the repie's name
    findDish = Recipes.map(e => e.name).indexOf(elm.id);
    //when to close the modal
    str = "<div class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></div>";
    //run the function that gets all the ingredients of a recipe
    str += "<h1>Ingredients details</h1>" + Recipes[findDish].getIngredients();

    //into the modal
    $("#cont").html(str);
}

//print lables for recipe
lblRecipe = () => {
    str = "<label for='recipeName'>Recipe name: </label><br /><input type='text' id='recipeName'><br /><br />"
    str += "<label for='recipeMethod'>Recipe cooking method: </label><br><input type='text' id='recipeMethod'><br /><br />"
    str += "<label for='recipeTime'>Recipe cooking time: </label><br><input type='text' id='recipeTime'><br /><br />"
    str += "<label for='recipeImage'>Recipe Image (url): </label><br><input type='text' id='recipeImage'><br /><br />"
    str += "<input type = 'checkbox' name = 'VideoCheckbox' id = 'VideoCheckbox' value = '0' /><label>&nbsp&nbsp add video</label>"
    str += "<div id = 'VideoDiv' style = 'display:none' ><label>Recipe video (url):</label><br/><input type='text' id='VideoInput'><br />"
    str += "<p><b>note:</b> replace <b> watch?v= </b> with <b> embed/</b></p></div > "

    str += "<h3>Choose ingridents</h3><div class='formGrid'>"

    ingredientJson.forEach((item, index) => {
        str += "<label>add&nbsp&nbsp<input id='recipe_" + index + "' type='checkbox' name='ingChk' value=''>";
        str += item.Render() + "</label>";
    })

    str += "</div><div><button class='btn btn-one myButton' id='createRecepie'>Create recipe</button> <button class='btn btn-one myButton close_btn'>Close</button></div><hr>"

    return str

}

// create Recipe from input text
createRecipe = () => {
    recipeName = $('#recipeName').val()
    recipeMethod = $('#recipeMethod').val()
    recipeTime = $('#recipeTime').val()
    recipeImage = $('#recipeImage').val()

    ingInRec = [];

    //get only checked ingredients for recipe
    $('input[name=ingChk]:checked').each(function () {
        idx = $(this).next("div").attr("id");
        ingInRec.push(ingredientJson[idx]);

    });

    if ($('input[name=VideoCheckbox]:checked').is(':checked'))
        obj = new VideoRecipes(recipeName, ingInRec, recipeTime, recipeMethod, recipeImage, $('#VideoInput').val())
    else
        obj = new DishRecipe(recipeName, ingInRec, recipeTime, recipeMethod, recipeImage)

    Recipes.push(obj);

    writtenRec = [];
    videoRec = [];

    Recipes.forEach(item => {
        if (item.constructor.name == "DishRecipe")
            writtenRec.push(item);
        else
            videoRec.push(item);
    })
    
    localStorage.setItem("writtenRec", JSON.stringify(writtenRec));
    localStorage.setItem("videoRec", JSON.stringify(videoRec));

    $("#simpleForm").html("<div class='alert alert-success'> your recipe was created successfully</div>");

}

//print all recpies
print_all_rec = (recType) => {
    $("#SearchRec").val('');
    str = "<div class='formGrid'>";

    Recipes.forEach(item => {

        if (recType == "DishRecipe") {
            if (item.constructor.name == "DishRecipe")
                str += "<label><div>" + item.Render1() + "</div></label>";
        }
        else {
            if (item.constructor.name == "VideoRecipes")
                str += "<label><div>" + item.Render2() + "</div></label>";
        }
    })

    $("#Dishes").html(str + "</div>");
    $("#Dishes").show();
    $("#simpleForm").html("");
}

printSearched = (namesRec) => {
    str = "<div class='formGrid'>";
    namesRec.forEach(item => {
    
        findDish = Recipes.map(e => e.name).indexOf(item);

        if (Recipes[findDish].constructor.name == "DishRecipe")
            str += "<label><div>" + Recipes[findDish].Render1() + "</div></label>";

        else
            str += "<label><div>" + Recipes[findDish].Render2() + "</div></label>";

    })
    str += "</div>";

    return str

   }

favorites_names = [];

//add recipe to my favorites
addToFavorites = (rec) => {
    id = rec.split("_");
    recName = id[1];

    document.getElementById(rec).hidden = true;
    let chk_exists = favorites_names.includes(recName)
    if (!chk_exists)
        favorites_names.push(recName);
    let favorites = printSearched(favorites_names);

    localStorage.setItem("favorites", JSON.stringify(favorites));
    localStorage.setItem("favorites_names", JSON.stringify(favorites_names));
 
}

//remove recipe from my favorites
removeFromFavorites = (rec) => {
    id = rec.split("_");
    recName = id[1];
    favorites_names = favorites_names.filter(function (item) {
        return item !== recName
    })
    document.getElementById(rec).innerHTML = "<i class='fa fa-plus'></i> My favorites";
    let favorites = printSearched(favorites_names);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    localStorage.setItem("favorites_names", JSON.stringify(favorites_names));

    $("#Dishes").html(favorites);
    $("#Dishes").show();
    $(".fav").css("display", "inline-block");
 
}

//show my favorites
print_favorites = () => {
    if (typeof (localStorage.getItem("favorites")) !== 'undefined')
        favorites = JSON.parse(localStorage.getItem("favorites"));
    if (typeof (localStorage.getItem("favorites_names")) !== 'undefined')
        favorites_names = JSON.parse(localStorage.getItem("favorites_names"));

    $("#Dishes").html(favorites);
    $("#Dishes").show();
    $(".fav").css("display", "inline-block");

}

// search recipes
SearchRecipes = () => {
    var input, filter, txtValue, names;
    input = document.getElementById("SearchRec");
    if ($("#SearchRec").val().length == 0) {
        $("#Dishes").html("");
        $("#dishes_c").show();
    }
    else {
        filter = input.value.toUpperCase();
        names = Recipes.map(e => e.name)
        found = [];
        for (i = 0; i < names.length; i++) {
            txtValue = names[i];
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                found.push(names[i]);
            }
        }
        str = printSearched(found);
        $("#Dishes").html(str + "</div>");
        $("#Dishes").show();
        $("#simpleForm").html("");
        if (namesRec.length > 0)
            $("#dishes_c").hide();
        else
            $("#dishes_c").show();

    }
}

