var $ = require('jquery');

var gitbook = window.gitbook;

// List of created buttons
var buttons = [],
// Generated Id for buttons
    BTN_ID = 0;

function generateId() {
    return 'btn-'+(BTN_ID++);
}

// Insert a jquery element at a specific position
function insertAt(parent, selector, index, element) {
    var lastIndex = parent.querySelectorAll(selector).length;
    if (index < 0) {
        index = Math.max(0, lastIndex + 1 + index);
    }
    parent.appendChild(element);

    if (index < lastIndex) {
        parent.querySelectorAll(selector)[index].before(parent.querySelectorAll(selector)[lastIndex - 1]);
    }
}

// Default click handler
function defaultOnClick(e) {
    e.preventDefault();
}

// Create a dropdown menu
function createDropdownMenu(dropdown) {
    var $menu = $('<div>', {
        'class': 'dropdown-menu',
        'html': '<div class="dropdown-caret"><span class="caret-outer"></span><span class="caret-inner"></span></div>'
    });

    if (typeof dropdown == 'string') {
        console.log("create dropdown menu", dropdown);
        $menu.append(dropdown);
    } else {
        var groups = dropdown.map(function(group) {
            if ($.isArray(group)) return group;
            else return [group];
        });

        // Create buttons groups
        groups.forEach(function(group) {
            var $group = $('<div>', {
                'class': 'buttons'
            });
            var sizeClass = 'size-'+group.length;

            // Append buttons
            group.forEach(function(btn) {
                btn = $.extend({
                    text: '',
                    className: '',
                    onClick: defaultOnClick
                }, btn || {});

                var $btn = $('<button>', {
                    'class': 'button '+sizeClass+' '+btn.className,
                    'text': btn.text
                });
                $btn.click(btn.onClick);

                console.log('group append button');
                $group.append($btn);
            });


            console.log('menu append group');
            $menu.append($group);
        });

    }


    return $menu;
}

// Create a new button in the toolbar
function createButton(opts) {
    opts = $.extend({
        // Aria label for the button
        label: '',

        // Icon to show
        icon: '',

        // Inner text
        text: '',

        // Right or left position
        position: 'left',

        // Other class name to add to the button
        className: '',

        // Triggered when user click on the button
        onClick: defaultOnClick,

        // Button is a dropdown
        dropdown: null,

        // Position in the toolbar
        index: null,

        // Button id for removal
        id: generateId()
    }, opts || {});

    buttons.push(opts);
    updateButton(opts);

    return opts.id;
}

// Update a button
function updateButton(opts) {
    var result;
    var toolbar = document.querySelector('.book-header');
    var title = toolbar.querySelector('h1');

    // Build class name
    var positionClass = 'pull-' + opts.position;

    // Create button
    var btn = document.createElement('a');
    btn.className = 'btn';
    btn.textContent = opts.text ? ' ' + opts.text : '';
    btn.setAttribute('aria-label', opts.label);
    btn.setAttribute('href', '#');

    // Bind click
    btn.addEventListener('click', opts.onClick);

    // Prepend icon
    if (opts.icon) {
        var icon = document.createElement('i');
        icon.className = opts.icon;
        btn.insertBefore(icon, btn.firstChild);
    }

    // Prepare dropdown
    if (opts.dropdown) {
        var container = document.createElement('div');
        container.className = 'dropdown ' + positionClass + ' ' + opts.className;

        // Add button to container
        btn.className += ' toggle-dropdown';
        console.log('container append button');
        container.appendChild(btn);

        // Create inner menu
        var menu = createDropdownMenu(opts.dropdown);

        // Menu position
        menu.className += ' dropdown-' + (opts.position == 'right' ? 'left' : 'right');

        console.log('container append menu');
        container.appendChild(menu);
        result = container;
    } else {
        btn.className += ' ' + positionClass + ' ' + opts.className;
        result = btn;
    }

    result.className += ' js-toolbar-action';

    if (typeof opts.index === 'number' && opts.index >= 0) {
        insertAt(toolbar, '.btn, .dropdown, h1', opts.index, result);
    } else {
        toolbar.insertBefore(result, title);
    }
}

// Update all buttons
function updateAllButtons() {
    $('.js-toolbar-action').remove();
    buttons.forEach(updateButton);
}

// Remove a button provided its id
function removeButton(id) {
    buttons = $.grep(buttons, function(button) {
        return button.id != id;
    });

    updateAllButtons();
}

// Remove multiple buttons from an array of ids
function removeButtons(ids) {
    buttons = $.grep(buttons, function(button) {
        return ids.indexOf(button.id) == -1;
    });

    updateAllButtons();
}

// When page changed, reset buttons
gitbook.events.on('page.change', function() {
    // updateAllButtons();
});

module.exports = {
    createButton: createButton,
    removeButton: removeButton,
    removeButtons: removeButtons
};
