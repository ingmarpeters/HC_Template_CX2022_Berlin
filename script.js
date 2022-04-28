/*!
 * Help Center Demo Builder
 *
 * Developed by Marcelo De Bortoli (EMEA Solution Developer)
 * This theme was developed based on the Zendesk Copenhagen theme
 *
 * Theme developed for demo purposes only. Do not share it externally.
 */

document.addEventListener('DOMContentLoaded', function () {
  // Key map
  var ENTER = 13
  var ESCAPE = 27
  var SPACE = 32
  var UP = 38
  var DOWN = 40
  var TAB = 9

  function closest(element, selector) {
    if (Element.prototype.closest) {
      return element.closest(selector)
    }
    do {
      if (
        (Element.prototype.matches && element.matches(selector)) ||
        (Element.prototype.msMatchesSelector &&
          element.msMatchesSelector(selector)) ||
        (Element.prototype.webkitMatchesSelector &&
          element.webkitMatchesSelector(selector))
      ) {
        return element
      }
      element = element.parentElement || element.parentNode
    } while (element !== null && element.nodeType === 1)
    return null
  }

  // social share popups
  Array.prototype.forEach.call(document.querySelectorAll('.share a'), function (
    anchor
  ) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      window.open(this.href, '', 'height = 500, width = 500')
    })
  })

  // In some cases we should preserve focus after page reload
  function saveFocus() {
    var activeElementId = document.activeElement.getAttribute('id')
    sessionStorage.setItem('returnFocusTo', '#' + activeElementId)
  }
  var returnFocusTo = sessionStorage.getItem('returnFocusTo')
  if (returnFocusTo) {
    sessionStorage.removeItem('returnFocusTo')
    var returnFocusToEl = document.querySelector(returnFocusTo)
    returnFocusToEl && returnFocusToEl.focus && returnFocusToEl.focus()
  }

  // show form controls when the textarea receives focus or backbutton is used and value exists
  var commentContainerTextarea = document.querySelector(
      '.comment-container textarea'
    ),
    commentContainerFormControls = document.querySelector(
      '.comment-form-controls, .comment-ccs'
    )

  if (commentContainerTextarea) {
    commentContainerTextarea.addEventListener(
      'focus',
      function focusCommentContainerTextarea() {
        commentContainerFormControls.style.display = 'block'
        commentContainerTextarea.removeEventListener(
          'focus',
          focusCommentContainerTextarea
        )
      }
    )

    if (commentContainerTextarea.value !== '') {
      commentContainerFormControls.style.display = 'block'
    }
  }

  // Expand Request comment form when Add to conversation is clicked
  var showRequestCommentContainerTrigger = document.querySelector(
      '.request-container .comment-container .comment-show-container'
    ),
    requestCommentFields = document.querySelectorAll(
      '.request-container .comment-container .comment-fields'
    ),
    requestCommentSubmit = document.querySelector(
      '.request-container .comment-container .request-submit-comment'
    )

  if (showRequestCommentContainerTrigger) {
    showRequestCommentContainerTrigger.addEventListener('click', function () {
      showRequestCommentContainerTrigger.style.display = 'none'
      Array.prototype.forEach.call(requestCommentFields, function (e) {
        e.style.display = 'block'
      })
      requestCommentSubmit.style.display = 'inline-block'

      if (commentContainerTextarea) {
        commentContainerTextarea.focus()
      }
    })
  }

  // Mark as solved button
  var requestMarkAsSolvedButton = document.querySelector(
      '.request-container .mark-as-solved:not([data-disabled])'
    ),
    requestMarkAsSolvedCheckbox = document.querySelector(
      '.request-container .comment-container input[type=checkbox]'
    ),
    requestCommentSubmitButton = document.querySelector(
      '.request-container .comment-container input[type=submit]'
    )

  if (requestMarkAsSolvedButton) {
    requestMarkAsSolvedButton.addEventListener('click', function () {
      requestMarkAsSolvedCheckbox.setAttribute('checked', true)
      requestCommentSubmitButton.disabled = true
      this.setAttribute('data-disabled', true)
      // Element.closest is not supported in IE11
      closest(this, 'form').submit()
    })
  }

  // Change Mark as solved text according to whether comment is filled
  var requestCommentTextarea = document.querySelector(
    '.request-container .comment-container textarea'
  )

  if (requestCommentTextarea) {
    requestCommentTextarea.addEventListener('input', function () {
      if (requestCommentTextarea.value === '') {
        if (requestMarkAsSolvedButton) {
          requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute(
            'data-solve-translation'
          )
        }
        requestCommentSubmitButton.disabled = true
      } else {
        if (requestMarkAsSolvedButton) {
          requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute(
            'data-solve-and-submit-translation'
          )
        }
        requestCommentSubmitButton.disabled = false
      }
    })
  }

  // Disable submit button if textarea is empty
  if (requestCommentTextarea && requestCommentTextarea.value === '') {
    requestCommentSubmitButton.disabled = true
  }

  // Submit requests filter form on status or organization change in the request list page
  Array.prototype.forEach.call(
    document.querySelectorAll(
      '#request-status-select, #request-organization-select'
    ),
    function (el) {
      el.addEventListener('change', function (e) {
        e.stopPropagation()
        saveFocus()
        closest(this, 'form').submit()
      })
    }
  )

  // Submit requests filter form on search in the request list page
  var quickSearch = document.querySelector('#quick-search')
  quickSearch &&
    quickSearch.addEventListener('keyup', function (e) {
      if (e.keyCode === ENTER) {
        e.stopPropagation()
        saveFocus()
        closest(this, 'form').submit()
      }
    })

  function toggleNavigation(toggle, menu) {
    var isExpanded = menu.getAttribute('aria-expanded') === 'true'
    menu.setAttribute('aria-expanded', !isExpanded)
    toggle.setAttribute('aria-expanded', !isExpanded)
  }

  function closeNavigation(toggle, menu) {
    menu.setAttribute('aria-expanded', false)
    toggle.setAttribute('aria-expanded', false)
    toggle.focus()
  }

  var burgerMenu = document.querySelector('.header .menu-button')
  var userMenu = document.querySelector('#user-nav')

  burgerMenu.addEventListener('click', function (e) {
    e.stopPropagation()
    toggleNavigation(this, userMenu)
  })

  userMenu.addEventListener('keyup', function (e) {
    if (e.keyCode === ESCAPE) {
      e.stopPropagation()
      closeNavigation(burgerMenu, this)
    }
  })

  if (userMenu.children.length === 0) {
    burgerMenu.style.display = 'none'
  }

  // Toggles expanded aria to collapsible elements
  var collapsible = document.querySelectorAll(
    '.collapsible-nav, .collapsible-sidebar'
  )

  Array.prototype.forEach.call(collapsible, function (el) {
    var toggle = el.querySelector(
      '.collapsible-nav-toggle, .collapsible-sidebar-toggle'
    )

    el.addEventListener('click', function (e) {
      toggleNavigation(toggle, this)
    })

    el.addEventListener('keyup', function (e) {
      if (e.keyCode === ESCAPE) {
        closeNavigation(toggle, this)
      }
    })
  })

  // Submit organization form in the request page
  var requestOrganisationSelect = document.querySelector(
    '#request-organization select'
  )

  if (requestOrganisationSelect) {
    requestOrganisationSelect.addEventListener('change', function () {
      closest(this, 'form').submit()
    })
  }

  // If a section has more than 6 subsections, we collapse the list, and show a trigger to display them all
  var seeAllTrigger = document.querySelector('#see-all-sections-trigger')
  var subsectionsList = document.querySelector('.section-list')

  if (subsectionsList && subsectionsList.children.length > 6) {
    seeAllTrigger.setAttribute('aria-hidden', false)

    seeAllTrigger.addEventListener('click', function (e) {
      subsectionsList.classList.remove('section-list--collapsed')
      seeAllTrigger.parentNode.removeChild(seeAllTrigger)
    })
  }

  // If multibrand search has more than 5 help centers or categories collapse the list
  var multibrandFilterLists = document.querySelectorAll(
    '.multibrand-filter-list'
  )
  Array.prototype.forEach.call(multibrandFilterLists, function (filter) {
    if (filter.children.length > 6) {
      // Display the show more button
      var trigger = filter.querySelector('.see-all-filters')
      trigger.setAttribute('aria-hidden', false)

      // Add event handler for click
      trigger.addEventListener('click', function (e) {
        e.stopPropagation()
        trigger.parentNode.removeChild(trigger)
        filter.classList.remove('multibrand-filter-list--collapsed')
      })
    }
  })

  // If there are any error notifications below an input field, focus that field
  var notificationElm = document.querySelector('.notification-error')
  if (
    notificationElm &&
    notificationElm.previousElementSibling &&
    typeof notificationElm.previousElementSibling.focus === 'function'
  ) {
    notificationElm.previousElementSibling.focus()
  }

  // Dropdowns

  function Dropdown(toggle, menu) {
    this.toggle = toggle
    this.menu = menu

    this.menuPlacement = {
      top: menu.classList.contains('dropdown-menu-top'),
      end: menu.classList.contains('dropdown-menu-end')
    }

    this.toggle.addEventListener('click', this.clickHandler.bind(this))
    this.toggle.addEventListener('keydown', this.toggleKeyHandler.bind(this))
    this.menu.addEventListener('keydown', this.menuKeyHandler.bind(this))
  }

  Dropdown.prototype = {
    get isExpanded() {
      return this.menu.getAttribute('aria-expanded') === 'true'
    },

    get menuItems() {
      return Array.prototype.slice.call(
        this.menu.querySelectorAll("[role='menuitem']")
      )
    },

    dismiss: function () {
      if (!this.isExpanded) return

      this.menu.setAttribute('aria-expanded', false)
      this.menu.classList.remove('dropdown-menu-end', 'dropdown-menu-top')
    },

    open: function () {
      if (this.isExpanded) return

      this.menu.setAttribute('aria-expanded', true)
      this.handleOverflow()
    },

    handleOverflow: function () {
      var rect = this.menu.getBoundingClientRect()

      var overflow = {
        right: rect.left < 0 || rect.left + rect.width > window.innerWidth,
        bottom: rect.top < 0 || rect.top + rect.height > window.innerHeight
      }

      if (overflow.right || this.menuPlacement.end) {
        this.menu.classList.add('dropdown-menu-end')
      }

      if (overflow.bottom || this.menuPlacement.top) {
        this.menu.classList.add('dropdown-menu-top')
      }

      if (this.menu.getBoundingClientRect().top < 0) {
        this.menu.classList.remove('dropdown-menu-top')
      }
    },

    focusNextMenuItem: function (currentItem) {
      if (!this.menuItems.length) return

      var currentIndex = this.menuItems.indexOf(currentItem)
      var nextIndex =
        currentIndex === this.menuItems.length - 1 || currentIndex < 0
          ? 0
          : currentIndex + 1

      this.menuItems[nextIndex].focus()
    },

    focusPreviousMenuItem: function (currentItem) {
      if (!this.menuItems.length) return

      var currentIndex = this.menuItems.indexOf(currentItem)
      var previousIndex =
        currentIndex <= 0 ? this.menuItems.length - 1 : currentIndex - 1

      this.menuItems[previousIndex].focus()
    },

    clickHandler: function () {
      if (this.isExpanded) {
        this.dismiss()
      } else {
        this.open()
      }
    },

    toggleKeyHandler: function (e) {
      switch (e.keyCode) {
        case ENTER:
        case SPACE:
        case DOWN:
          e.preventDefault()
          this.open()
          this.focusNextMenuItem()
          break
        case UP:
          e.preventDefault()
          this.open()
          this.focusPreviousMenuItem()
          break
        case ESCAPE:
          this.dismiss()
          this.toggle.focus()
          break
      }
    },

    menuKeyHandler: function (e) {
      var firstItem = this.menuItems[0]
      var lastItem = this.menuItems[this.menuItems.length - 1]
      var currentElement = e.target

      switch (e.keyCode) {
        case ESCAPE:
          this.dismiss()
          this.toggle.focus()
          break
        case DOWN:
          e.preventDefault()
          this.focusNextMenuItem(currentElement)
          break
        case UP:
          e.preventDefault()
          this.focusPreviousMenuItem(currentElement)
          break
        case TAB:
          if (e.shiftKey) {
            if (currentElement === firstItem) {
              this.dismiss()
            } else {
              e.preventDefault()
              this.focusPreviousMenuItem(currentElement)
            }
          } else if (currentElement === lastItem) {
            this.dismiss()
          } else {
            e.preventDefault()
            this.focusNextMenuItem(currentElement)
          }
          break
        case ENTER:
        case SPACE:
          e.preventDefault()
          currentElement.click()
          break
      }
    }
  }

  var dropdowns = []
  var dropdownToggles = Array.prototype.slice.call(
    document.querySelectorAll('.dropdown-toggle')
  )

  dropdownToggles.forEach(function (toggle) {
    var menu = toggle.nextElementSibling
    if (menu && menu.classList.contains('dropdown-menu')) {
      dropdowns.push(new Dropdown(toggle, menu))
    }
  })

  document.addEventListener('click', function (evt) {
    dropdowns.forEach(function (dropdown) {
      if (!dropdown.toggle.contains(evt.target)) {
        dropdown.dismiss()
      }
    })
  })
})

document.addEventListener('DOMContentLoaded', function () {
  const headerContainer = document.querySelector('.header-container')
  const alertDialog = document.querySelector('.alert-message')

  const bodyTop =
    headerContainer.getBoundingClientRect().top -
    document.body.getBoundingClientRect().top

  // Position sticky alert
  if (alertDialog) {
    alertDialog.style.top = bodyTop + 'px'
  }
})

// Click events
document.addEventListener('click', function (event) {
  // Close alert message
  if (event.target.matches('.close-alert')) {
    event.preventDefault()
    document.querySelector(event.target.dataset.target).style.display = 'none'
  }
})

// *****************************************************************************************************
// *****************************************************************************************************
// *****************************************************************************************************

//Include Sunshine Conversations Web SDK
!function(o,p,s,e,c){
  var i,a,h,u=[],d=[];function t(){var t="You must provide a supported major version.";try{if(!c)throw new Error(t);var e,n="https://cdn.smooch.io/",r="smooch";if((e="string"==typeof this.response?JSON.parse(this.response):this.response).url){var o=p.getElementsByTagName("script")[0],s=p.createElement("script");s.async=!0;var i=c.match(/([0-9]+)\.?([0-9]+)?\.?([0-9]+)?/),a=i&&i[1];if(i&&i[3])s.src=n+r+"."+c+".min.js";else{if(!(4<=a&&e["v"+a]))throw new Error(t);s.src=e["v"+a]}o.parentNode.insertBefore(s,o)}}catch(e){e.message===t&&console.error(e)}}o[s]={init:function(){i=arguments;var t={then:function(e){return d.push({type:"t",next:e}),t},catch:function(e){return d.push({type:"c",next:e}),t}};return t},on:function(){u.push(arguments)},render:function(){a=arguments},destroy:function(){h=arguments}},o.__onWebMessengerHostReady__=function(e){if(delete o.__onWebMessengerHostReady__,o[s]=e,i)for(var t=e.init.apply(e,i),n=0;n<d.length;n++){var r=d[n];t="t"===r.type?t.then(r.next):t.catch(r.next)}a&&e.render.apply(e,a),h&&e.destroy.apply(e,h);for(n=0;n<u.length;n++)e.on.apply(e,u[n])};var n=new XMLHttpRequest;n.addEventListener("load",t),n.open("GET","https://"+e+".webloader.smooch.io/",!0),n.responseType="json",n.send()
}(window,document,"Smooch","625f3086c6f30400f3773442","5");

//Initialise Sunshine Conversations Web Messenger
Smooch.init({ integrationId: '625f3086c6f30400f3773442',
canUserSeeConversationList: false,
delegate: {
       beforeDisplay(message, data) {
       //Add avatarURL to message 
       message.avatarUrl = "https://cdn.shopify.com/s/files/1/1061/1924/products/Robot_Emoji_Icon_7070a254-26f7-4a54-8131-560e38e34c2e_grande.png"
       
       //Do not display "hidden" messages
       if (message.metadata && message.metadata.isHidden) {
           return null;
       }
       return message;
   }
}
}).then(function() {
       // Your code after init is complete
       //Create Conversation if one does not exist
       var Conversations = Smooch.getConversations()
       if ( Conversations.length == 0){
           Smooch.createConversation({
               displayName: "Welcome!!",
               description: "Zendesk CX Trends 2022",
           })
       } 
   }
);

//Send hidden message when the widget is opened and the conversation has no messages
Smooch.on('widget:opened', function () {
//Get Conversation & Send Message
{
           Smooch.getConversationById().then(function(conversation) {
             if (conversation.messages.length == 0){
               Smooch.sendMessage(
               {
                   type: 'text',
                   text: 'DACH Roadshow',
                   metadata: {
                   isHidden:true
                   }
               },
               conversation.id,
               ); 
               }
             } 
           );
       }
});


// *****************************************************************************************************
// *****************************************************************************************************
// *****************************************************************************************************
   
////////////////////////////////////////////////////////////////////////////////
// Ticket Subject/Description Customizer v1.0                                 //
////////////////////////////////////////////////////////////////////////////////
// This script allows you to hide the required subject/description fields in  //
// a Zendesk contact form and replace them with any text and/or custom fields //
////////////////////////////////////////////////////////////////////////////////
// Developed by Marcelo De Bortoli (EMEA Solution Developer)                  //
////////////////////////////////////////////////////////////////////////////////

// Configuration
////////////////////////////////////////////////////////////////////////////////

const ticketFormConfig = [
  {
    // Set your ticket form ID
    formId: 4710225526685, //Order Coffee

    // Set your desired form subject
    subject: `Neue Bestellung: {{4710342226205}}`,

    // Set your desired form subject
    description: `--- Eine neue Bestellung --- <br /><br />Kaffee Variante: {{4710342226205}}<br />Milch: {{4942215521181}}<br /><br />Kommentar: {{4920672149661}}`
	},
  {
    // Set your ticket form ID
    formId: 4942050482461, //Order Healthgarden

    // Set your desired form subject
    subject: `Neue Bestellung: {{4943683259933}}`,

    // Set your desired form subject
    description: `--- Eine neue Bestellung --- <br /><br />Menü: {{4943683259933}}<br />Topping: {{4943785515421}}<br /><br />Kommentar: {{4948049610525}}`
  },
  {
    // Set your ticket form ID
    formId: 4943420047261, //Order Drink

    // Set your desired form subject
    subject: `Neue Bestellung: {{4943806135709}}`,

    // Set your desired form subject
    description: `--- Eine neue Bestellung --- <br /><br />Signature Drink: {{4943806135709}}<br />Filler: {{4943840599453}}<br /><br />Kommentar: {{4948049610525}}`
  },
  {
    // Set your ticket form ID
    formId: 5000237497629, //Order Drink Recipe

    // Set your desired form subject
    subject: `Rezeptanforderung: {{4943806135709}}`,

    // Set your desired form subject
    description: `--- Eine neue Rezeptanforderung --- <br /><br />Signature Drink: {{4943806135709}}<br /><br />Kommentar: {{4948049610525}}`
  }
  // You can set rules for multiple forms by adding new objects to this variable.
  // {
  //   formId: 360000000000,
  //   subject: 'This is the new subject of your second form',
  //   description: 'This is the new description of your second form'
  // }
];



// Do not change anything below this line
////////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('new_request') && ticketFormConfig) {
    const formSelector = document.querySelector('.request_ticket_form_id select');
    const currentForm = formSelector.options[formSelector.selectedIndex].value;

    // Hide Form selector and get form title
    const ticketform = document.getElementsByClassName("request_ticket_form_id");
    const formtitle = ticketform[0].childNodes[2].innerText;
    ticketform[0].style.display = 'none';

    // Replace default title with form title
    const requesttitle = document.getElementById("request_title")
    requesttitle.innerText = formtitle
    
    // Check if the current selected form is in the configuration array
    const matchingForm = ticketFormConfig.find(o => o.formId == currentForm);

    if (matchingForm) {
      // Hide subject/description fields
      document.querySelector('.request_subject').style.display = 'none';
      document.querySelector('.request_description').style.display = 'none';

      // Hide Upload Attachement Fields
      var inputs = document.getElementsByTagName('label');
      for(var i = 0; i < inputs.length; i++) {
        if (inputs[i].outerText == "Anhänge(optional)"){
          inputs[i].parentNode.style.display = 'none';
        }        
      }     
      
      // Replace subject/description values by the new data before form submission
      document.querySelector('#new_request input[type=submit]').addEventListener('click', function (e) {
        const newSubject = (matchingForm.subject ? getDynamicText(matchingForm.subject) : 'No subject');
        const newDescription = (matchingForm.description ? getDynamicText(matchingForm.description) : 'No description');
        
        document.getElementById('request_subject').value = newSubject;        
        var elementWeb =  document.getElementById('request_description_ifr');
				if (typeof(elementWeb) != 'undefined' && elementWeb != null) {
          document
            .getElementById('request_description_ifr')
            .contentWindow.document.querySelector('#tinymce').innerHTML =
            newDescription
				}

        var elementMobile =  document.getElementById('request_description');
				if (typeof(elementMobile) != 'undefined' && elementMobile != null){
          document.getElementById('request_description').value = newDescription;
        }
      });
    }
  }
});

// Return dynamic text from custom field values.
// Usage: Specify your text keeping the required label names between double curly braces.
// Example: getDynamicText('New visit request to {{Store}} store at {{Preferred time slot}}')
// Return example: 'New visit request to London store at 11:30'
function getDynamicText(str) {
  const labels = str.match(/{{([^}]*)}}/g);

  if (labels) {
    for (let i = 0; i < labels.length; i++) {
      const labelName = labels[i].replace(/{{|}}/g, '');

      const fieldId = getFieldIdByLabel(labelName);
      const fieldValue = (!fieldId ? getFieldValueById(`request_custom_fields_${labelName}`) : getFieldValueById(fieldId));

      const returnValue = (fieldValue ? fieldValue : undefined);

      if (returnValue) {
        str = str.replace(labels[i], returnValue);
      }
      else {
        str = str.replace(labels[i], "-");
      }
    }
  }

  return str;
}

// Get custom field value by its input ID
// Usage example: getFieldValueById('request_custom_fields_360009915379')
function getFieldValueById(id) {
  const element = document.getElementById(id);

  if (!element) {
    return undefined;
  }

  const rawValue = element.value;
  const rawoutertext = element.outerText;
  if (rawoutertext != "") {
    return rawoutertext
  }
  else {
	  const fieldNames = JSON.parse(element.getAttribute('data-tagger'));
  	const fieldValue = (fieldNames ? fieldNames.find(o => o.value === rawValue) : rawValue);

    return (fieldValue && fieldValue.label ? fieldValue.label : fieldValue);    
  }
}

// Get custom field ID by its label text
// Usage example: getFieldIdByLabel('Store')
// Return example: 'request_custom_fields_360009915379'
function getFieldIdByLabel(label) {
  const labelTags = document.getElementsByTagName('label');
  let field = '';

  for (let i = 0; i < labelTags.length; i++) {
    if (labelTags[i].childNodes[0].textContent == label) {
      field = labelTags[i];
      break;
    }
  }

  return (field.htmlFor ? field.htmlFor : undefined);
}