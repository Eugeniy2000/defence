
function DynamicAdapt(type) {
	this.type = type;
}

// data-da=".content__column-garden, 900, 1" присваевается елменту который нужно переместить

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();

$(".defence-info__footer-btn").click(function(){
	$(this).closest(".defence").hide().next().css("display", "block")
	if($(".form-page").find(".line-position-active").is(".form-progress__item-piece")){
		let Active = $(".line-position-active");
		Active.addClass("past-active")
		Active.closest(".form-progress__head-item").addClass("form-progress__head-item--active")
		let LineWidth = Active.position().left;
		$(".form-progress--active").css("width", LineWidth + 20)
	} else {
		let Active = $(".form-progress__head-item").first();
		Active.addClass("form-progress__head-item--active")
		Active.addClass("line-position-active")
		Active.addClass("past-active")
		$(".form-progress--active").css("width", "20%")
	}
	if($(this).hasClass("defence-info__footer-btn--nocitizen")){
		$('.form-content__inner--citizen').remove();
	} else {
		$('.form-content__inner--nocitizen').remove();
	}
});

let slider = `
<div class="form-content__line form-content__line-slider">
	<label class="form-content__label">Доля страховой суммы</label>
	<div class="form-content__range-value">10%</div>
	<div class="sliders sliders--percent" id="first"></div>
</div>
`;

if ($(".form-content__line-slider").children().length){
	var sliderFirst = document.getElementById('first0');
	let SliderValueFirst = $(sliderFirst).closest(".form-content__line-slider").find(".form-content__range-value");
	noUiSlider.create(sliderFirst, {
		start: 10,
		step: 1,
		connect: "lower",
		orientation: "horizontal",
		range: {
			'min': 0,
			'max': 100
		},
		format: wNumb({
			decimals: 0,
			suffix: '%'
		})
	});
	sliderFirst.noUiSlider.on('slide', function () {
		var allValues = [];
		allValues.push(sliderFirst.noUiSlider.get());
		$(SliderValueFirst).text(allValues)
	});
}

let Progress = function(){
	let count = $(".form-page").find(".form").length;
	let widthContainer = $(window).width() - 30;
	let widthNow = $(".form-progress--active").width();
	$(".form-progress--active").css("width", widthNow + widthContainer/count) 
};

let insured = function(){
	$(".form-content__number").click(function(){
		let index = $(this).closest(".form-content__number-item").index();
		if($(this).hasClass("form-content__number--back")){
			$(".form-content__number--active").addClass("form-content__number--back").removeClass("form-content__number--active")
			$(this).addClass("form-content__number--active")
			$(this).closest(".form-content__big-inner").find(".form-content__big-content").addClass("form-content__big-content--disable");
			$(this).closest(".form-content__big-inner").find(".form-content__big-content").eq(index).removeClass("form-content__big-content--disable");
			console.log(index)
			console.log($(this).closest(".form-content__big-inner").find(".form-content__big-content").index())
		} else {
			return false;
		}
	});
	
	
	let i = 0
	$(".form-content__button--add").click(function(){
		if($(this).closest(".form-content__big-inner").find(".form-content__big-content").length > 11){
			return false;
		} else {
			let Content = $(this).closest(".form-content__big-content");
			let Inner = $(this).closest(".form-content__big-inner")
			let place = $(this).closest('.form-content__big-inner')
			Content.clone(true).removeClass("form-content__big-content--disable").appendTo(place);
			if($(".form-content__line-slider").children().length){
				i = ++i
				let newId = "first" + i;
				Content.closest(".form-content__big-inner").find(".form-content__big-content").last().find(".form-content__line-slider").remove(".form-content__line-slider")
				Content.closest(".form-content__big-inner").find(".form-content__body").last().append(slider);
				Content.closest(".form-content__big-inner").find(".sliders").last().attr("id", newId);
				console.log("heewee")
				var sliderNow = document.getElementById(newId);
				let sliderValue = Content.closest(".form-content__big-inner").find(".form-content__range-value").last()
				noUiSlider.create(sliderNow, {
					start: 10,
					step: 1,
					connect: "lower",
					orientation: "horizontal",
					range: {
						'min': 0,
						'max': 100
					},
					format: wNumb({
						decimals: 0,
						suffix: '%'
					})
				});
				sliderNow.noUiSlider.on('slide', function () {
					var allValues = [];
					allValues.push(sliderNow.noUiSlider.get());
					console.log(allValues)
					sliderValue.text(allValues);
				});
			}
			Content.addClass("form-content__big-content--disable");
			Content.next().find("input[type=radio]").prop('checked',false);
			Inner.find(".form-content__number--active").removeClass("form-content__number--active");
			Inner.find(".form-content__number--last").addClass("form-content__number--back");
			Inner.find(".form-content__number--last").removeClass("form-content__number--last").closest(".form-content__number-item").next().find(".form-content__number").addClass("form-content__number--last");
			Inner.find(".form-content__number--last").addClass("form-content__number--active");
			if (Content.index() == Content.siblings().length-1){
				Content.next().find(".form-content__input").val('')
			} else {
				Content.siblings(":last").find(".form-content__input").val('')
			}
		}
	});

	$(".form-content__button-insured").click(function(){
		$(this).closest(".form").addClass("show-on-success");
		let Active = $(".line-position-active");
		Active.removeClass("line-position-active")
		if(Active.next().hasClass("form-progress__item-piece")){
			Active = Active.next()
			Active.addClass("line-position-active")
			Active.addClass("past-active");
			$(".form-progress--stabile").css("width", Active.closest(".form-progress__head-item").position().left - 20)
			$(".form-progress--active").css("width", Active.position().left + 10)
		} else {
			Active.closest(".form-progress__head-item").addClass("form-progress__head-item--past")
			$(".form-progress__head-item--active").removeClass("form-progress__head-item--active");
			Active = Active.closest(".form-progress__head-item").next();
			Active.addClass("form-progress__head-item--active");
			if(Active.find(".form-progress__item-piece").hasClass("form-progress__item-piece")){
				Active = Active.find(".form-progress__item-piece").first();
				Active.addClass("line-position-active")
				Active.addClass("past-active");
				$(".form-progress--stabile").css("width", Active.closest(".form-progress__head-item").position().left - 20)
				$(".form-progress--active").css("width", Active.position().left + 10);
			} else {
				Active.addClass("line-position-active")
				Active.addClass("past-active");
				$(".form-progress--stabile").css("width", Active.position().left - 20)
				$(".form-progress--active").css("width", "20%");
			}
		}
		if($(window).width() < 767){
			Progress();
		}
	});
}

insured();

let formValidate = function(){
	$('form').each(function(){
	 $(this).on('submit', function(){
	  $(this).validate({
	   rules: {
		name: 'required',
		tel: 'required',
		email: "required",
		password: 'required',
		textreq: "required",
		check: 'required',
	   },
	   messages: {
		name: 'Введите корректное имя',
		tel: 'Введите корректный номер',
		email: 'Введите корректный email',
		password: 'Введите корректный пароль',
		textreq: "Заполните это поле"
	   },
	   errorPlacement: function (error, element) {
		element.attr("placeholder", error[0].outerText);
	   }
	  });
	  if ($(this).valid()){
		$(this).closest(".form").addClass("show-on-success");
		$(this).closest(".form").next(".form").removeClass("show-on-success");
		event.preventDefault();
		if($(this).closest(".form").is(':last-child')){
			$(".form-end__access").removeClass("show-on-success");
			$(".form-progress__content").hide();
		}
		if($(this).closest(".form").hasClass("details-content__form")){
			if($(this).closest(".form").next("div").hasClass("details-content__popup")){
				$.magnificPopup.open({
					items: {
						src: '#form-end',
						type: 'inline',
						closeOnContentClick: false,
					}
				});
				$('.details-content__popup-button').on('click',function(event){
					event.preventDefault();
					$.magnificPopup.close();
				}); 
			} else {
				let detailsCounter = document.querySelector(".details-content__header-count--active");
				$(detailsCounter).next().find(".details-content__decor").addClass("details-content__decor--active")
				$(detailsCounter).find(".details-content__decor").removeClass("details-content__decor--active")
				$(detailsCounter).next().addClass("details-content__header-count--active");
				$(detailsCounter).removeClass("details-content__header-count--active");
			}
		} else if($(this).closest(".form").hasClass("form-content__inner")){
			
			let Active = $(".line-position-active");
			if(Active.closest(".form-progress__head-item").is(":last-child")){
				return false;
			}
			if(Active.next().hasClass("form-progress__item-piece")){
				Active.removeClass("line-position-active")
				Active = Active.next()
				Active.addClass("line-position-active")
				Active.addClass("past-active")
				$(".form-progress--active").css("width", Active.position().left + 20)
			} else {
				$(".form-progress--stabile").css("margin-right", 20)
				Active.removeClass("line-position-active")
				Active.closest(".form-progress__head-item").addClass("form-progress__head-item--past")
				Active.closest(".form-progress__head-item").removeClass("form-progress__head-item--active")
				if(Active.closest(".form-progress__head-item").next().find(".form-progress__item-piece").hasClass("form-progress__item-piece")){
					Active = Active.closest(".form-progress__head-item").next().find(".form-progress__item-piece").first();
					Active.addClass("line-position-active")
					Active.addClass("past-active")
					Active.closest(".form-progress__head-item").addClass("form-progress__head-item--active")
					$(".form-progress--stabile").css("width", Active.closest(".form-progress__head-item").position().left - 20)
					$(".form-progress--active").css("width", Active.position().left + 10)
				} else {
					Active = Active.closest(".form-progress__head-item").next();
					Active.addClass("line-position-active");
					Active.addClass("past-active");
					Active.addClass("form-progress__head-item--active");
					$(".form-progress--stabile").css("width", Active.position().left - 20);
					$(".form-progress--active").css("width", "20%");
				}
			}
			if($(window).width() < 767){
				Progress();
			}
		}
	  }
	  return false;
	 })
	});
};

formValidate();



let PayCheck = function(){
	$(".form-content__input-check--all").click(function(){
		let payChecks = document.querySelectorAll(".form-content__input-check--pay")
		if($(".form-content__input-check--all").is(":checked")){
			$(payChecks).each(function() {
				$(this).prop( "checked", true );
			});
		} else {
			$(payChecks).each(function() {
				$(this).prop( "checked", false );
			});
		}
	});
}

let pageBack = function(){
	$(".form-content__button--back").click(function(){
		let Active = $(".past-active").last();
		let index = $(this).closest(".form").index();
		if(index == 1){
			return false;
		} else {
			let PositionActive = $(".line-position-active");
			PositionActive.removeClass("past-active")
			PositionActive.removeClass("line-position-active")
			let PreviousActive = $(".past-active").last();
			PreviousActive.addClass("line-position-active")
			if($(Active).is(".form-progress__head-item") || $(".form-progress__item-piece.line-position-active").index() == -1){
				PositionActive.closest(".form-progress__head-item").removeClass("form-progress__head-item--active");
				PreviousActive.closest(".form-progress__head-item").addClass("form-progress__head-item--active");
				PreviousActive.closest(".form-progress__head-item").removeClass("form-progress__head-item--past");
				PreviousActive = $(".past-active").last();
				if(PreviousActive.closest(".form-progress__head-item").find(".form-progress__item-piece").hasClass("form-progress__item-piece")){
					if(PreviousActive.closest(".form-progress__head-item").index() == 0){
						$(".form-progress--stabile").css("width", 0)
						$(".form-progress--stabile").css("margin-right", 0)
					} else {
						let HeadActiveIndex = PreviousActive.closest(".form-progress__head-item").index();
						let PastHeadItem = $(".form-progress__head-item").eq(HeadActiveIndex - 1)
						$(".form-progress--stabile").css("width", PastHeadItem.position().left)
					}
					$(".form-progress--active").css("width", PreviousActive.position().left + 20)
				} else {
					$(".form-progress--stabile").css("width", PreviousActive.position().left - 20)
					$(".form-progress--active").css("width", "20%")
				}
			} else {
				$(".form-progress--active").css("width", PreviousActive.position().left + 25)
			}
			let ThisForm = $(this).closest(".form");
			ThisForm.removeClass("hide-on-success");
			ThisForm.addClass("show-on-success");
			let PreviousElement = $(".form").eq(index - 2);
			PreviousElement.removeClass("show-on-success")
			PreviousElement.addClass("hide-on-success")
		}
		if($(window).width() < 767){
			let count = $(".form-page").find(".form").length;
			let widthContainer = $(window).width() - 30;
			let widthNow = $(".form-progress--active").width();
			$(".form-progress--active").css("width", widthNow - widthContainer/count) 
		}
	});
}

var sliders = document.getElementsByClassName('sliders');
let sliderValue = document.getElementsByClassName('form-content__range-value');

for ( var i = 0; i < sliders.length; i++ ) {

	let now = sliders[i]
	if($(now).hasClass("sliders--percent")){
		noUiSlider.create(now, {
			start: 10,
			step: 1,
			connect: "lower",
			orientation: "horizontal",
			range: {
				'min': 0,
				'max': 100
			},
			format: wNumb({
				decimals: 0,
				suffix: '%'
			})
		});
	} else {
		noUiSlider.create(sliders[i], {
			start: 10000,
			step: 1000,
			connect: "lower",
			orientation: "horizontal",
			range: {
				'min': 1000,
				'max': 150000
			},
			format: wNumb({
				decimals: 0,
				thousand: ' ',
				suffix: '₽'
			})
		});
	}

	sliders[i].noUiSlider.on('slide', function () {
		var allValues = [];
		for (var i = 0; i < sliders.length; i++) {

			// store values in array to pass through ajax...
			allValues.push(sliders[i].noUiSlider.get());

			// assign the slider value to the corresponding noUiSlider
			sliderValue[i + 1].innerHTML = sliders[i].noUiSlider.get();
		};
	});
}

let RisksValue = function(){
	$(".risks-content__add").click(function(){
		$(this).next().addClass("risks-content__value-now--active");
		$(this).closest(".risks-content__main-line ").find(".risks-content__added").addClass("risks-content__added--active");
		$(this).hide();
	});
};

let Count = function(){
	$(document).ready(function() {
		$('.risks-content__time-counter--minus').click(function () {
			var $input = $(this).parent().find('input');
			var count = parseInt($input.val()) - 1;
			count = count < 5 ? 5 : count;
			$input.val(count);
			$input.change();
			return false;
		});
		$('.risks-content__time-counter--plus').click(function () {
			var $input = $(this).parent().find('input');
			$input.val(parseInt($input.val()) + 1);
			$input.change();
			return false;
		});
	});
};

Count();
RisksValue();
PayCheck();
pageBack();

let images = document.querySelector(".data__images");

function download(input) {
  let file = input.files[0];
  let reader = new FileReader();
  reader.readAsDataURL(file);
  let name = file.name;
  reader.onload = function () {
    
    let text = document.querySelector(".details-content__form-file-name");
    text.innerHTML = name;
  }
}

Inputmask().mask(document.querySelectorAll("input"));

let select = function () {
    let selectHeader = document.querySelectorAll('.select__header');
    let selectItem = document.querySelectorAll('.select__item');
  
    selectHeader.forEach(item => {
        item.addEventListener('click', selectToggle)
    });
  
    selectItem.forEach(item => {
        item.addEventListener('click', selectChoose)
    });
  
    function selectToggle() {
        this.parentElement.classList.toggle('is-active');
    }
  
    function selectChoose() {
        let text = this.innerText,
            select = this.closest('.select__content'),
            currentText = select.querySelector('.select__current');
            icon = this.closest(".select__header");
        currentText.innerText = text;
        select.classList.remove('is-active');
    }
};

let btnLoc = $(".select__header");
let listLoc = $(".select__body")

$(document).mouseup(function(e){
	if( ! btnLoc.is(e.target) && btnLoc.has(e.target).length === 0 &&
		! listLoc.is(e.target) && listLoc.has(e.target).length === 0
		) {
			$(".select__content").removeClass("is-active");
	}
});

select()

$(".header-nav__block-header").click(function(){
	if($(this).siblings().hasClass("header-nav__sublist")){
		event.preventDefault()
		$(this).siblings(".header-nav__sublist").toggleClass("header-nav__sublist--active");
		$(this).toggleClass("header-nav__block-header--active");
	}
	let btnNav = $(".header-nav__block-header");
	let listNav = $(".header-nav__sublist")

	$(document).mouseup(function(e){
		if( ! btnNav.is(e.target) && btnNav.has(e.target).length === 0 &&
			! listNav.is(e.target) && listNav.has(e.target).length === 0
			) {
				btnNav.removeClass("header-nav__block-header--active")
				listNav.removeClass("header-nav__sublist--active")
		}
	});
});

$(".burger").click(function(){
	$(this).toggleClass("burger--active");
	$("body").toggleClass("lock");
	$(".menu").toggleClass("menu--active");
});

$(".services-table__col-more").click(function(){
	$(this).toggleClass("services-table__col-more--active");
	$(this).siblings(".services-table__col-inside").toggleClass("services-table__col-inside--active");
});




$(".questions-item__head").click(function(){
	$(this).toggleClass("questions-item__head--active");
	$(this).siblings(".questions-item__inside-list").toggleClass("questions-item__inside-list--active");
	let btnNav = $(".questions-item__head");
	let listNav = $(".questions-item__inside-list")

	$(document).mouseup(function(e){
		if( ! btnNav.is(e.target) && btnNav.has(e.target).length === 0 &&
			! listNav.is(e.target) && listNav.has(e.target).length === 0
			) {
				btnNav.removeClass("questions-item__head--active")
				listNav.removeClass("questions-item__inside-list--active")
		}
	});
});


$(".accident-item__prev").click(function(){
	$(".accident-item__prev").removeClass("accident-item__prev--active")
	$(this).addClass("accident-item__prev--active");
	$(".accident-item__inside").removeClass("accident-item__inside--active")
	$(this).closest(".accident-item").next(".accident-item__inside").toggleClass("accident-item__inside--active");
});