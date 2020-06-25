
var pokemonRepository = (function() {
  var pokemonArray = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function add(pokemon) {
    pokemonArray.push(pokemon);
  }

function getAll() {
  return pokemonArray;
}

function addListItem(pokemon) {
    var $pokelist = $('.pokemon-list');
    var $listItem = $(
      '<button type="button" class="list-group-item list-group-item-action" data-toggle="modal" data-target=".modal"></button>'
    ).text(pokemon.name[0].toUpperCase() + pokemon.name.slice(1));
    $pokelist.append($listItem);
    $listItem.on('click', function() {
      showDetails(pokemon);
    });
  }

  function loadList() {
      return $.ajax(apiUrl, {dataType: 'json'})
      // JSON used to exchange data back and forth with external servers
        // If the promise is resolved, .then is run
        .then(function(item) {
          $.each(item.results, function(i, item){
            var pokemon = {
              name: item.name,
              detailsUrl: item.url
            };
            add(pokemon);
          });
        })
      .catch(function(e) {
        console.error(e);
      });
    }

    function loadDetails(pokemon) {
		var url = pokemon.detailsUrl;
		return $.ajax(url)
			.then(function(details) {
         // Adds the details to each item
				pokemon.imageUrl = details.sprites.front_default;
				pokemon.height = details.height;
				pokemon.weight = details.weight;
				pokemon.types = details.types.map(function(object) {
					return object.type.name;
				});
			})

			.catch(function(e) {
				console.error(e);
			});
	}

  function showDetails(pokemon) {
      pokemonRepository
        .loadDetails(pokemon)
        .then(function() {
          showModal(pokemon);
        })
        .catch(function(e) {
          console.error(e);
        });
    }

    function showModal(pokemon) {
      var $modalContainer = $('#modal-container');
      $modalContainer.find('#pokemon-name').text(pokemon.name);
      $modalContainer.find(".pokemon-img").attr("src", pokemon.imageUrl).attr("alt", `Image of ${pokemon.name}`);
      $modalContainer.find(".pokemon-weight").text('Height: '+ pokemon.weight);
      $modalContainer.find(".pokemon-types").text('Types: '+ pokemon.types);


      $('.close').click(function() {
          $('.modal-backdrop').remove();
          $modalContainer.empty();
          $('body').removeClass('modal-open');
        });

      }

      return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,
        showModal: showModal,
        showDetails: showDetails,
        loadList: loadList,
        loadDetails: loadDetails,

  	};
  })();

  pokemonRepository.loadList().then(function() {
  $.each(pokemonRepository.getAll(), function(index, pokemon) {
    pokemonRepository.loadDetails(pokemon);
    pokemonRepository.addListItem(pokemon);
  });
});



// Preloader

var preloaderFadeOutTime = 2000

$(document).ready(function () {
  function hidePreloader() {
    var preloader = $('.preloader')
    preloader.fadeOut(preloaderFadeOutTime)
  }
  hidePreloader()
})
