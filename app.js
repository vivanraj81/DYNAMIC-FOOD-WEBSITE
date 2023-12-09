document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search");
  const searchResultsContainer = document.querySelector(".searchresult-res");
  const randomResSection = document.querySelector(".random-res");
  const modal = document.getElementById("modal");
  const overlay = document.getElementById("overlay");
  const popupImage = document.getElementById("popupImage");
  const popupText = document.querySelector(".popup-text");
  const Allrandomandsearch = document.querySelector(".allrandomandsearch");
  const closebutton = document.querySelector(".close-button")
  const NotFound = document.querySelector(".showerror")

          // FETCHING DATA AND RENDERING IN MAIN SCREEN WHEN SCREEN IS RELOADED

  function fetchRandomImage() {
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const randomImageUrl = data.meals[0].strMealThumb;
        const mealName = data.meals[0].strMeal;

        randomResSection.innerHTML = `
                    <div class="text">
                        <h2>What’s There in our plate today</h2>
                    </div>
                    <div class="imgbg">
                        <div>
                            <img class="randomimg" src="${randomImageUrl}" alt="">
                        </div>
                        <div class="food">
                            <h2>${mealName}</h2>
                        </div>
                    </div>
                `;
      })
      .catch((error) => {
        console.error("Error fetching random image:", error);
      });
  }

  fetchRandomImage();

        // MODAL INFORMATION LIKE IMAGE , NAME , INGREDIENTS

  function showModal(imageUrl, mealName, ingredients) {
    popupImage.src = imageUrl;
    popupText.innerHTML = `
            <h2>${mealName}</h2>
            <p>Ingredients: ${ingredients}</p>
        `;

    modal.classList.add("active");
    overlay.classList.add("active");
  }

  function closeModal() {
    modal.classList.remove("active");
    overlay.classList.remove("active");
  }

         
      // SEARCHING AND RENDERING PART LIKE IMAGE , NAME 

  searchInput.addEventListener("input", function (event) {
    const searchTerm = event.target.value;

    searchResultsContainer.innerHTML = "";

    if (searchTerm !== "") {
      fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data && data.meals) {
            data.meals.forEach((meal) => {
              const imageUrl = meal.strMealThumb;
              const foodName = meal.strMeal;

              const searchResultItem = document.createElement("div");
              searchResultItem.classList.add("searchimg");

              searchResultItem.innerHTML = `
                                <div>
                                    <img class="randomimg" src="${imageUrl}" alt="${foodName}">
                                </div>
                                <div class="food">
                                    <h2>${foodName}</h2>
                                </div>`;

              searchResultsContainer.appendChild(searchResultItem);
            });
          } else {
            NotFound.innerHTML = `<div class="noresfound">
            <h2>No Results Found</h2>
        </div>`;
          }
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
        });
    }
  });
            // MODAL PART 
    //  FETCHING INGREDIENTS OF CLICKED ELEMENT AND A MODAL WILL COME

  Allrandomandsearch.addEventListener("click", function (event) {
    const clickedElement = event.target;

    if (clickedElement.tagName === "IMG") {
      const imageUrl = clickedElement.src;
      const foodName = clickedElement.alt;
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`)
        .then((response) => response.json())
        .then((data) => {
          const meal = data.meals[0];
          const ingredients =
            meal.strIngredient1 +
            ", " +
            meal.strIngredient2 +
            ", " +
            meal.strIngredient3 +
            ", " +
            meal.strIngredient4 +
            ", " +
            meal.strIngredient5;
          showModal(imageUrl, foodName, ingredients);
        })
        .catch((error) => {
          console.error("Error fetching ingredients:", error);
        });
    }
  });
  closebutton.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);
});
