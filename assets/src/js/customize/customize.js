import React from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionReplace from 'react-css-transition-replace';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

const l10n = ClientdashCustomize_Data.l10n || false;
const roles = ClientdashCustomize_Data.roles || false;
const adminurl = ClientdashCustomize_Data.adminurl || false;
const domain = ClientdashCustomize_Data.domain || false;
const dashicons = ClientdashCustomize_Data.dashicons || false;

/**
 * Returns an item in an array based on the item ID.
 *
 * @since {{VERSION}}
 *
 * @param items
 * @param ID
 * @returns {boolean}
 */
const getItem = function (items, ID) {

    var found = false;

    items.map((item) => {

        if (item.id === ID) {

            found = item;
        }
    });

    return found;
}

/**
 * Gets an items index by the item ID.
 *
 * @since {{VERSION}}
 *
 * @param items
 * @param ID
 * @returns {int|bool}
 */
const getItemIndex = function (items, ID) {

    var index = false;

    items.map((item, i) => {

        if (item.id === ID) {

            index = i;
        }
    });

    return index;
}

/**
 * Delets an item in an array based on the item ID.
 *
 * @since {{VERSION}}
 *
 * @param items
 * @param ID
 * @returns {boolean}
 */
const deleteItem = function (items, ID) {

    items = items.filter((item) => {

        return item.id !== ID;
    });

    return items;
}

/**
 * Modifies an item in an array based on the supplied new item.
 *
 * @since {{VERSION}}
 *
 * @param items
 * @param ID
 * @param new_item
 * @returns {*}
 */
const modifyItem = function (items, ID, new_item) {

    items = items.map((item) => {

        if (item.id === ID) {

            Object.keys(new_item).map((key) => {

                item[key] = new_item[key];
            });
        }

        return item;
    });

    return items;
}

/**
 * Returns all items marked "deleted" from a list.
 *
 * @since {{VERSION}}
 *
 * @param {[]} items
 * @returns {[]}
 */
const getDeletedItems = function (items) {

    items = items.filter((item) => {

        return item.deleted;
    });

    return items;
}

/**
 * Returns all items not marked "deleted" from a list.
 *
 * @since {{VERSION}}
 *
 * @param {{}} items
 * @returns {{}}
 */
const getAvailableItems = function (items) {

    items = items.filter((item) => {

        return !item.deleted;
    });

    return items;
}

/**
 * Sets each item's title to the original title.
 *
 * @since {{VERSION}}
 *
 * @param items
 * @returns {*}
 */
const setToOriginalTitles = function (items) {

    items = items.map((item) => {

        item.title = item.original_title;

        return item;
    });

    return items;
}

/**
 * Modify the sortable cancel start callback to include <button>'s.
 *
 * @since {{VERSION}}
 *
 * @param e
 */
const sortableCancelStart = function (e) {

    var unallowed_classes = [
        'cd-editor-lineitem-action',
        'cd-editor-dashicons-selector',
        'cd-editor-dashicons-selector-field',
    ];

    var unallowed_tags = [
        'input',
        'textarea',
        'select',
        'option',
        'button',
        'label',
        'form'
    ];

    var cancel = false;

    unallowed_classes.map((className) => {

        if (e.target.className.includes(className) || e.target.parentNode.className.includes(className)) {

            cancel = true;
        }
    });

    if (!cancel) {

        cancel = unallowed_tags.indexOf(e.target.tagName.toLowerCase()) !== -1;
    }

    return cancel;
}

/**
 * Select box option.
 *
 * @since {{VERSION}}
 *
 * @prop (string) value The option value.
 * @prop (string) text The option text.
 * @prop (bool) selected If the option is selected or not.
 */
class SelectOption extends React.Component {
    render() {
        return (
            <option value={this.props.value}>
                {this.props.text}
            </option>
        )
    }
}

/**
 * Select box.
 *
 * @since {{VERSION}}
 *
 * @prop (array) options The options to show in value => text format.
 * @prop (string) selected The option value which is currently selected.
 * @prop (bool) multi If the select allows multiple selections or not.
 */
class Select extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            value: ''
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {

        this.setState({
            value: event.target.value
        });

        this.props.onHandleChange(event.target.value);
    }

    render() {

        var options = [];

        this.props.options.map((option) =>
            options.push(
                <SelectOption key={option.value} value={option.value} text={option.text}/>
            )
        );

        return (
            <div className="cd-editor-input cd-editor-input-select">
                {this.props.before}

                <label>
                    {this.props.label}
                    <select
                        name={this.props.name}
                        value={this.props.selected}
                        multiple={this.props.multi}
                        onChange={this.handleChange}
                        disabled={this.props.disabled}>
                        {options}
                    </select>
                </label>

                {this.props.after}
            </div>
        )
    }
}

/**
 * Text input.
 *
 * @since {{VERSION}}
 *
 * @prop (string) name Input name.
 * @prop (string) label Input label.
 * @prop (string) value Input value.
 */
class InputText extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            value: ''
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {

        this.setState({
            value: event.target.value
        });

        this.props.onHandleChange(event.target.value);
    }

    render() {
        return (
            <div className="cd-editor-input cd-editor-input-text">
                {this.props.before}

                <label>
                    {this.props.label}
                    <input
                        type="text"
                        name={this.props.name}
                        defaultValue={this.props.value}
                        placeholder={this.props.placeholder}
                        onChange={this.handleChange}
                    />
                </label>

                {this.props.after}
            </div>
        )
    }
}

/**
 * Individual Dashicon option within the DashiconsSelector
 *
 * @since {{VERSION}}
 */
class DashiconsSelectorOption extends React.Component {

    constructor(props) {

        super(props);

        this.selectDashicon = this.selectDashicon.bind(this);
    }

    selectDashicon() {

        this.props.onSelectDashicon(this.props.dashicon);
    }

    render() {
        return (
            <span
                key={this.props.dashicon}
                className={"cd-editor-dashicons-selector-option dashicons " + this.props.dashicon}
                onClick={this.selectDashicon}
            />
        )
    }
}

/**
 * Provies an expandable window for choosing a Dashicon.
 *
 * @since {{VERSION}}
 */
class DashiconsSelector extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            selected: this.props.dashicon || '',
            open: false
        }

        this.toggleWindow = this.toggleWindow.bind(this);
        this.selectDashicon = this.selectDashicon.bind(this);
    }

    toggleWindow() {

        this.setState((prevState) => ({
            open: !prevState.open
        }));
    }

    selectDashicon(dashicon) {

        this.setState({
            selected: dashicon,
            open: false
        });

        this.props.onSelectDashicon(dashicon);
    }

    render() {

        var dashicon_options = [];

        dashicons.map((dashicon) => {
            dashicon_options.push(
                <DashiconsSelectorOption
                    key={dashicon}
                    dashicon={dashicon}
                    onSelectDashicon={this.selectDashicon}
                />
            );
        });

        return (
            <div className="cd-editor-dashicons-selector">
                <div className="cd-editor-dashicons-selector-label" onClick={this.toggleWindow}>
                    {l10n['icon']}
                </div>

                <div className="cd-editor-dashicons-selector-field" onClick={this.toggleWindow}>
                    <span className={"dashicons " + this.state.selected}/>

                    <span className={"cd-editor-dashicons-selector-field-icon " +
                     "fa fa-chevron-" + (this.state.open ? "up" : "down")}/>
                </div>

                {this.state.open &&
                <div className="cd-editor-dashicons-selector-window">
                    {dashicon_options}
                </div>
                }
            </div>
        )
    }
}

/**
 * Action button that appears in header and footer of Customizer.
 *
 * @since {{VERSION}}
 *
 * @prop (string) text The button text.
 * @prop (string) icon The button icon.
 * @prop (string) align Alignment.
 */
class ActionButton extends React.Component {

    constructor(props) {

        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {

        if (!this.props.disabled) {

            this.props.onHandleClick();
        }
    }

    render() {

        var type_class = 'default';

        switch (this.props.type) {
            case 'primary':

                type_class = 'primary';
                break;

            case 'delete':

                type_class = 'delete';
                break;
        }

        var classes = [
            'cd-editor-action-button',
            'cd-editor-action-button-' + type_class
        ];

        if (this.props.align) {

            classes.push(this.props.align);
        }

        if (this.props.disabled) {

            classes.push('cd-editor-action-button-disabled');
        }

        return (
            <button type="button" title={this.props.text} aria-label={this.props.text} className={classes.join(' ')}
                    onClick={this.handleClick}>

                {this.props.icon &&
                <span className={"cd-editor-action-button-icon fa fa-" + this.props.icon}></span>
                }
            </button>
        )
    }
}

/**
 * Action buttons for line items.
 *
 * @since {{VERSION}}
 */
class LineItemAction extends React.Component {

    constructor(props) {

        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {


        this.props.onHandleClick();
    }

    render() {
        return (
            <button
                type="button" title={this.props.text}
                className={"cd-editor-lineitem-action " + (this.props.classes ? this.props.classes : "")}
                onClick={this.handleClick}
            >
                <span className={"cd-editor-lineitem-action-icon fa fa-" + this.props.icon}/>
            </button>
        )
    }
}

/**
 * The edit form for a line item.
 *
 * @since {{VERSION}}
 */
class LineItemForm extends React.Component {

    constructor(props) {

        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {

        event.preventDefault();

        this.props.onSubmit(event);
    }

    render() {
        return (
            <form className="cd-editor-lineitem-form" onSubmit={this.handleSubmit}>
                {this.props.children}
            </form>
        )
    }
}

/**
 * Generic line item.
 *
 * @since {{VERSION}}
 *
 * @prop (string) title Item title.
 * @prop (string) icon The item icon class (complete).
 * @prop (array) formInputs Inputs to send to the form, if any.
 */
class LineItemContent extends React.Component {
    render() {
        return (
            <div id={"cd-editor-lineitem-" + this.props.id}
                 className={"cd-editor-lineitem " + (this.props.classes ? this.props.classes : '')}>
                <div className="cd-editor-lineitem-block">
                    <div className="cd-editor-lineitem-title">
                        {this.props.icon &&
                        <span className={"cd-editor-lineitem-icon dashicons " + this.props.icon}></span>
                        }
                        {this.props.title}
                    </div>

                    <div className="cd-editor-lineitem-actions">
                        {this.props.actions}
                    </div>
                </div>

                {this.props.form && this.props.form}
            </div>
        )
    }
}

/**
 * Line item wrapper.
 *
 * @since {{VERSION}}
 */
class LineItem extends React.Component {
    render() {
        return (
            <li className="cd-editor-lineitem-li" data-id={this.props.id}>
                {this.props.children}
            </li>
        )
    }
}

/**
 * Sortable line item wrapper.
 *
 * @since {{VERSION}}
 */
const SortableLineItem = SortableElement(({item}) => {
    return (
        <li className="cd-editor-lineitem-li" data-id={item.key}>
            {item}
        </li>
    );
})

/**
 * Line items container.
 *
 * @since {{VERSION}}
 */
class LineItems extends React.Component {
    render() {
        return (
            <ul className="cd-editor-lineitems">
                {this.props.items.map((item, index) =>
                    <LineItem key={`item-${index}`} id={item.id}>
                        {item}
                    </LineItem>
                )}
            </ul>
        )
    }
}
;

/**
 * Sortable line items container.
 *
 * @since {{VERSION}}
 */
const SortableLineItems = SortableContainer(({items}) => {
    return (
        <ul className="cd-editor-lineitems sortable">
            {items.map((item, index) =>
                <SortableLineItem
                    key={`item-${index}`}
                    index={index}
                    item={item}
                />
            )}
        </ul>
    );
});

/**
 * Line item for editing a menu item.
 *
 * @since {{VERSION}}
 */
class MenuItemEdit extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            editing: false,
        }

        this.toggleEdit = this.toggleEdit.bind(this);
        this.titleChange = this.titleChange.bind(this);
        this.iconChange = this.iconChange.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.submenuEdit = this.submenuEdit.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    toggleEdit() {

        this.setState((prevState) => ({
            editing: !prevState.editing
        }));
    }

    titleChange(value) {

        this.props.onMenuItemEdit({
            id: this.props.id,
            icon: this.props.icon,
            title: value,
            original_title: this.props.originalTitle,
        });
    }

    iconChange(value) {

        this.props.onMenuItemEdit({
            id: this.props.id,
            icon: value,
            title: this.props.title,
            original_title: this.props.originalTitle,
        });
    }

    deleteItem() {

        this.props.onDeleteItem(this.props.id);
    }

    submenuEdit() {

        this.props.onSubmenuEdit(this.props.id);
    }

    submitForm(event) {

        this.props.onItemFormSubmit();
    }

    render() {

        var actions = [];

        if (this.props.id != 'clientdash') {
            actions = [
                <LineItemAction
                    key="menu-action-submenu"
                    icon="th-list"
                    text={l10n['edit_submenu']}
                    onHandleClick={this.submenuEdit}
                />,
                <LineItemAction
                    key="menu-action-edit"
                    icon={this.state.editing ? "chevron-up" : "chevron-down"}
                    text={l10n['edit']}
                    onHandleClick={this.toggleEdit}
                />,
                <LineItemAction
                    key="menu-action-delete"
                    icon="times"
                    text={l10n['delete']}
                    classes="cd-editor-lineitem-action-close"
                    onHandleClick={this.deleteItem}
                />
            ];
        }

        const after_title =
                <span className="cd-editor-lineitem-form-originaltitle">
                    {l10n['original_title'] + " "}<strong>{this.props.originalTitle}</strong>
                </span>
            ;

        const form =
                <LineItemForm
                    onSubmit={this.submitForm}
                >
                    <InputText
                        label={l10n['title']}
                        value={this.props.title}
                        placeholder={this.props.originalTitle}
                        onHandleChange={this.titleChange}
                        after={after_title}
                    />

                    <DashiconsSelector
                        dashicon={this.props.icon}
                        onSelectDashicon={this.iconChange}
                    />

                </LineItemForm>
            ;

        return (
            <LineItemContent
                key={this.props.id}
                id={this.props.id}
                title={this.props.title || this.props.originalTitle}
                icon={this.props.icon}
                actions={actions}
                form={this.props.active || this.state.editing ? form : false}
            />
        )
    }
}

/**
 * Line item for a separator.
 *
 * @since {{VERSION}}
 */
class MenuItemSeparator extends React.Component {

    constructor(props) {

        super(props);

        this.deleteItem = this.deleteItem.bind(this);
    }

    deleteItem() {

        this.props.onDeleteItem(this.props.id);
    }

    render() {

        const actions = [
            <LineItemAction
                key="menu-action-delete"
                icon="times"
                classes="cd-editor-lineitem-action-close"
                onHandleClick={this.deleteItem}
            />
        ];

        return (
            <LineItemContent
                key={this.props.id}
                id={this.props.id}
                title={l10n['separator']}
                classes="cd-editor-menuitem-separator"
                actions={actions}
            />
        )
    }
}

/**
 * Line item for editing a menu item custom link.
 *
 * @since {{VERSION}}
 */
class MenuItemCustomLink extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            editing: false,
        }

        this.toggleEdit = this.toggleEdit.bind(this);
        this.titleChange = this.titleChange.bind(this);
        this.linkChange = this.linkChange.bind(this);
        this.iconChange = this.iconChange.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.submenuEdit = this.submenuEdit.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    toggleEdit() {

        this.setState((prevState) => ({
            editing: !prevState.editing
        }));
    }

    titleChange(value) {

        this.props.onMenuItemEdit({
            id: this.props.id,
            icon: this.props.icon,
            title: value,
            link: this.props.link,
            original_title: this.props.originalTitle,
            type: 'custom_link',
        });
    }

    linkChange(value) {

        this.props.onMenuItemEdit({
            id: this.props.id,
            icon: this.props.icon,
            link: value,
            title: this.props.title,
            original_title: this.props.originalTitle,
            type: 'custom_link',
        });
    }

    iconChange(value) {

        this.props.onMenuItemEdit({
            id: this.props.id,
            icon: value,
            link: this.props.link,
            title: this.props.title,
            original_title: this.props.originalTitle,
            type: 'custom_link',
        });
    }

    deleteItem() {

        this.props.onDeleteItem(this.props.id);
    }

    submenuEdit() {

        this.props.onSubmenuEdit(this.props.id);
    }

    submitForm(event) {

        this.props.onItemFormSubmit();
    }

    render() {

        var actions = [];

        if (this.props.id != 'clientdash') {
            actions = [
                <LineItemAction
                    key="menu-action-submenu"
                    icon="th-list"
                    text={l10n['edit_submenu']}
                    onHandleClick={this.submenuEdit}
                />,
                <LineItemAction
                    key="menu-action-edit"
                    icon={this.state.editing ? "chevron-up" : "chevron-down"}
                    text={l10n['edit']}
                    onHandleClick={this.toggleEdit}
                />,
                <LineItemAction
                    key="menu-action-delete"
                    icon="times"
                    text={l10n['delete']}
                    classes="cd-editor-lineitem-action-close"
                    onHandleClick={this.deleteItem}
                />
            ];
        }

        const after_title =
                <span className="cd-editor-lineitem-form-originaltitle">
                    {l10n['original_title'] + " "}<strong>{this.props.originalTitle}</strong>
                </span>
            ;

        const form =
                <LineItemForm
                    onSubmit={this.submitForm}
                >
                    <InputText
                        label={l10n['title']}
                        value={this.props.title}
                        placeholder={this.props.originalTitle}
                        onHandleChange={this.titleChange}
                        after={after_title}
                    />

                    <InputText
                        label={l10n['link']}
                        value={this.props.link}
                        placeholder="http://"
                        onHandleChange={this.linkChange}
                    />

                    <DashiconsSelector
                        dashicon={this.props.icon}
                        onSelectDashicon={this.iconChange}
                    />

                </LineItemForm>
            ;

        return (
            <LineItemContent
                key={this.props.id}
                id={this.props.id}
                title={this.props.title || this.props.originalTitle}
                icon={this.props.icon}
                actions={actions}
                form={this.state.editing ? form : false}
            />
        )
    }
}

/**
 * Line item for editing a sub menu item.
 *
 * @since {{VERSION}}
 */
class SubmenuItemEdit extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            editing: false,
            title: this.props.title,
            icon: this.props.icon
        }

        this.toggleEdit = this.toggleEdit.bind(this);
        this.titleChange = this.titleChange.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    toggleEdit() {

        this.setState((prevState) => ({
            editing: !prevState.editing
        }));
    }

    titleChange(value) {

        this.props.onSubmenuItemEdit({
            id: this.props.id,
            title: value,
            original_title: this.props.originalTitle,
        });
    }

    deleteItem() {

        this.props.onDeleteItem(this.props.id);
    }

    submitForm(event) {

        this.props.onItemFormSubmit();
    }

    render() {

        const actions = [
            <LineItemAction
                key="menu-action-edit"
                icon={this.state.editing ? "chevron-up" : "chevron-down"}
                onHandleClick={this.toggleEdit}
            />,
            <LineItemAction
                key="menu-action-delete"
                icon="times"
                classes="cd-editor-lineitem-action-close"
                onHandleClick={this.deleteItem}
            />
        ];

        const after_title =
                <span className="cd-editor-lineitem-form-originaltitle">
                    {l10n['original_title'] + " "}<strong>{this.props.originalTitle}</strong>
                </span>
            ;

        const form =
                <LineItemForm
                    onSubmit={this.submitForm}
                >
                    <InputText
                        label={l10n['title']}
                        value={this.props.title}
                        placeholder={this.props.originalTitle}
                        onHandleChange={this.titleChange}
                        after={after_title}
                    />
                </LineItemForm>
            ;


        return (
            <LineItemContent
                key={this.props.id}
                title={this.props.title || this.props.originalTitle}
                actions={actions}
                form={this.state.editing ? form : false}
            />
        )
    }
}

/**
 * Line item for adding an item.
 *
 * @since {{VERSION}}
 */
class ItemAdd extends React.Component {

    constructor(props) {

        super(props);

        this.addItem = this.addItem.bind(this);
    }

    addItem() {

        // Note the "title" and "original_title" to bring to compatibility with the MenuPanel
        this.props.onAddItem({
            id: this.props.id,
            title: '',
            original_title: this.props.title,
            icon: this.props.icon,
        });
    }

    render() {

        const actions = [
            <LineItemAction
                key="menu-item-action-add"
                icon="plus"
                classes="cd-editor-lineitem-action-add"
                onHandleClick={this.addItem}
            />
        ];

        return (
            <LineItemContent
                key={this.props.id}
                title={this.props.title}
                icon={this.props.icon}
                actions={actions}
                classes={this.props.id == 'separator' && 'cd-editor-menuitem-separator'}
            />
        )
    }
}

/**
 * Primary panel action button.
 *
 * Shows on primary panel. Clicking loads new panels.
 *
 * @since {{VERSION}}
 *
 * @prop (string) text The text to show in the action.
 * @prop (string) target The target panel ID.
 */
class PanelLoadButton extends React.Component {

    constructor(props) {

        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {

        this.props.onLoadPanel(this.props.target);
    }

    render() {
        return (
            <div className="cd-editor-panel-load-button" onClick={this.handleClick}>
                {this.props.text}
                <span className="cd-editor-panel-icon fa fa-chevron-right"></span>
            </div>
        )
    }
}

/**
 * A Customizer panel.
 *
 * One panel shows at a time and they can be loaded and unloaded.
 *
 * @since {{VERSION}}
 */
class Panel extends React.Component {
    render() {
        return (
            <div className={"cd-editor-panel " + "cd-editor-panel-" + this.props.id}>
                {this.props.children}
            </div>
        )
    }
}

/**
 * Header of Customizer that contains the primary actions.
 *
 * Actions are: Hide Customizer, Close Customizer, Save Settings
 *
 * @since {{VERSION}}
 */
class PrimaryActions extends React.Component {

    constructor(props) {

        super(props);

        this.saveChanges = this.saveChanges.bind(this);
        this.previewChanges = this.previewChanges.bind(this);
        this.hideCustomizer = this.hideCustomizer.bind(this);
        this.closeCustomizer = this.closeCustomizer.bind(this);
    }

    saveChanges() {

        if (this.props.saving) {

            return;
        }

        this.props.onSaveChanges();
    }

    previewChanges() {

        this.props.onPreviewChanges();
    }

    hideCustomizer() {

        this.props.onHideCustomizer();
    }

    closeCustomizer() {

        this.props.onCloseCustomizer();
    }

    render() {
        return (
            <div className="cd-editor-primary-actions">

                <ActionButton
                    text="Hide"
                    icon="chevron-circle-left"
                    disabled={this.props.saving || this.props.disabled}
                    onHandleClick={this.hideCustomizer}
                />
                <ActionButton
                    text="Close"
                    icon="times"
                    disabled={this.props.saving || this.props.disabled}
                    onHandleClick={this.closeCustomizer}
                />
                <ActionButton
                    text="Preview"
                    icon={this.props.loadingPreview ? "circle-o-notch fa-spin" : "eye"}
                    disabled={this.props.saving || this.props.disabled}
                    onHandleClick={this.previewChanges}
                />
                <ActionButton
                    text={this.props.changes ? l10n['save'] : l10n['up_to_date']}
                    icon={this.props.saving ? "circle-o-notch fa-spin" : (this.props.changes ? "floppy-o" : "check")}
                    disabled={!this.props.changes || this.props.saving || this.props.disabled}
                    type="primary"
                    onHandleClick={this.saveChanges}
                />
            </div>
        )
    }
}

/**
 * Select box for switching witch role is being edited.
 *
 * @since {{VERSION}}
 */
class RoleSwitcher extends React.Component {

    constructor(props) {

        super(props);

        this.switchRole = this.switchRole.bind(this);
    }

    switchRole(value) {

        this.props.onSwitchRole(value);
    }

    render() {

        return (
            <div className="cd-editor-role-switcher">
                <Select
                    options={roles}
                    label={l10n['role_switcher_label']}
                    selected={this.props.role}
                    disabled={this.props.disabled}
                    onHandleChange={this.switchRole}
                />
            </div>
        )
    }
}

/**
 * The primary (and first loading) panel.
 *
 * @since {{VERSION}}
 */
class PanelPrimary extends React.Component {

    constructor(props) {

        super(props);

        this.loadPanel = this.loadPanel.bind(this);
    }

    loadPanel(panel_ID) {

        this.props.onLoadPanel(panel_ID, 'forward');
    }


    render() {
        return (
            <Panel id="primary">
                <PanelLoadButton
                    text={l10n['panel_text_menu']}
                    target="menu"
                    onLoadPanel={this.loadPanel}
                />
                <PanelLoadButton
                    text={l10n['panel_text_dashboard']}
                    target="dashboard"
                    onLoadPanel={this.loadPanel}
                />
            </Panel>
        )
    }
}

/**
 * The menu editor panel.
 *
 * Edits the admin menu.
 *
 * @since {{VERSION}}
 */
class PanelMenu extends React.Component {

    constructor(props) {

        super(props);

        this.onSortEnd = this.onSortEnd.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.menuItemEdit = this.menuItemEdit.bind(this);
        this.submenuEdit = this.submenuEdit.bind(this);
        this.itemSubmitForm = this.itemSubmitForm.bind(this);
    }

    onSortEnd(args) {

        var new_order = arrayMove(this.props.menuItems, args.oldIndex, args.newIndex);

        this.props.onReOrderMenu(new_order);
    }

    deleteItem(ID) {

        this.props.onDeleteItem(ID);
    }

    menuItemEdit(item) {

        this.props.onMenuItemEdit(item);
    }

    submenuEdit(ID) {

        this.props.onSubmenuEdit(ID);
    }

    itemSubmitForm(event) {

        this.props.onItemSubmitForm(event);
    }

    render() {

        var menu_items = [];
        var panel_contents;

        if (this.props.menuItems.length) {

            this.props.menuItems.map((item) => {

                if (item.type == 'separator') {

                    var menu_item =
                            <MenuItemSeparator
                                key={item.id}
                                id={item.id}
                                onDeleteItem={this.deleteItem}
                            />
                        ;

                } else if (item.type == 'custom_link') {

                    var menu_item =
                            <MenuItemCustomLink
                                key={item.id}
                                id={item.id}
                                title={item.title}
                                link={item.link}
                                originalTitle={item.original_title}
                                icon={item.icon}
                                hasSubmenu={item.hasSubmenu}
                                onMenuItemEdit={this.menuItemEdit}
                                onSubmenuEdit={this.submenuEdit}
                                onDeleteItem={this.deleteItem}
                                onItemFormSubmit={this.itemSubmitForm}
                            />
                        ;

                } else {

                    var menu_item =
                            <MenuItemEdit
                                key={item.id}
                                id={item.id}
                                title={item.title}
                                originalTitle={item.original_title}
                                icon={item.icon}
                                active={this.props.lastAdded === item.id}
                                hasSubmenu={item.hasSubmenu}
                                onMenuItemEdit={this.menuItemEdit}
                                onSubmenuEdit={this.submenuEdit}
                                onDeleteItem={this.deleteItem}
                                onItemFormSubmit={this.itemSubmitForm}
                            />
                        ;
                }


                menu_items.push(menu_item);
            });

            panel_contents =
                <SortableLineItems
                    items={menu_items}
                    onSortEnd={this.onSortEnd}
                    axis="y"
                    lockAxis="y"
                    lockToContainerEdges={true}
                    shouldCancelStart={sortableCancelStart}
                />
            ;

        } else {

            panel_contents =
                <div className="cd-editor-panel-helptext">
                    {l10n['no_items_added']}
                </div>
        }

        return (
            <Panel id="menu">
                {panel_contents}
            </Panel>
        )
    }
}

/**
 * The sub-menu editor panel.
 *
 * Edits the admin menu.
 *
 * @since {{VERSION}}
 */
class PanelSubmenu extends React.Component {

    constructor(props) {

        super(props);

        this.onSortEnd = this.onSortEnd.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.submenuItemEdit = this.submenuItemEdit.bind(this);
        this.itemSubmitForm = this.itemSubmitForm.bind(this);
    }

    onSortEnd(args) {

        var new_order = arrayMove(this.props.submenuItems, args.oldIndex, args.newIndex);

        this.props.onReOrderSubmenu(new_order);
    }

    deleteItem(item_id) {

        this.props.onDeleteItem(item_id);
    }

    submenuItemEdit(item) {

        this.props.onSubmenuItemEdit(item);
    }

    itemSubmitForm(event) {

        this.props.onItemSubmitForm(event);
    }

    render() {

        var menu_items = [];
        var panel_contents;

        if (this.props.submenuItems.length) {

            this.props.submenuItems.map((item) => {

                menu_items.push(
                    <SubmenuItemEdit
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        onSubmenuItemEdit={this.submenuItemEdit}
                        originalTitle={item.original_title}
                        onDeleteItem={this.deleteItem}
                        onItemFormSubmit={this.itemSubmitForm}
                    />
                );
            });

            panel_contents =
                <SortableLineItems
                    items={menu_items}
                    onSortEnd={this.onSortEnd}
                    axis="y"
                    lockAxis="y"
                    lockToContainerEdges={true}
                    shouldCancelStart={sortableCancelStart}
                />
            ;

        } else {

            panel_contents =
                <div className="cd-editor-panel-helptext">
                    {l10n['no_items_added']}
                </div>
        }

        return (
            <Panel id="submenu">
                {this.props.itemInfo}
                {panel_contents}
            </Panel>
        )
    }
}

/**
 * The add items panel.
 *
 * @since {{VERSION}}
 */
class PanelAddItems extends React.Component {

    constructor(props) {

        super(props);

        this.addItem = this.addItem.bind(this);
    }

    addItem(item) {

        this.props.onAddItem(item);
    }

    render() {

        var menu_items = [];
        var panel_contents;

        if (this.props.availableItems.length) {

            this.props.availableItems.map((item) => {

                menu_items.push(
                    <ItemAdd
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        icon={item.icon}
                        onAddItem={this.addItem}
                    />
                );
            });

            panel_contents = <LineItems items={menu_items}/>;

        } else {

            panel_contents =
                <div className="cd-editor-panel-helptext">
                    {l10n['no_items_available']}
                </div>
            ;
        }

        return (
            <Panel id="add-items">
                {this.props.itemInfo}

                {panel_contents}
            </Panel>
        )
    }
}

/**
 * The Dashboard panel
 *
 * @since {{VERSION}}
 */
class PanelDashboard extends React.Component {

    constructor(props) {

        super(props);

        this.widgetDelete = this.widgetDelete.bind(this);
        this.widgetEdit = this.widgetEdit.bind(this);
        this.itemSubmitForm = this.itemSubmitForm.bind(this);
    }

    widgetDelete(ID) {

        this.props.onDeleteWidget(ID);
    }

    widgetEdit(widget) {

        this.props.onWidgetEdit(widget);
    }

    itemSubmitForm(event) {

        this.props.onItemSubmitForm(event);
    }

    render() {

        var widgets = [];
        var panel_contents;

        if (Object.keys(this.props.widgets).length) {

            this.props.widgets.map((item) => {

                widgets.push(
                    <WidgetEdit
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        originalTitle={item.original_title}
                        onWidgetEdit={this.widgetEdit}
                        onWidgetDelete={this.widgetDelete}
                        onItemFormSubmit={this.itemSubmitForm}
                    />
                );
            });

            panel_contents =
                <LineItems items={widgets}/>
            ;

        } else {

            panel_contents =
                <div className="cd-editor-panel-helptext">
                    {l10n['no_items_added']}
                </div>
        }

        return (
            <Panel id="dashboard">
                {panel_contents}
            </Panel>
        )
    }
}

/**
 * Panel for loading indicator.
 *
 * @since {{VERSION}}
 */
class PanelLoading extends React.Component {
    render() {

        return (
            <Panel id="loading">
                <span className="fa fa-circle-o-notch fa-spin"></span>
            </Panel>
        )
    }
}

/**
 * Panel with nothing in it.
 *
 * @since {{VERSION}}
 */
class PanelBlank extends React.Component {
    render() {

        return (
            <Panel id="blank">
            </Panel>
        )
    }
}

/**
 * Line item for editing a widget.
 *
 * @since {{VERSION}}
 */
class WidgetEdit extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            editing: false,
        }

        this.toggleEdit = this.toggleEdit.bind(this);
        this.titleChange = this.titleChange.bind(this);
        this.widgetDelete = this.widgetDelete.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    toggleEdit() {

        this.setState((prevState) => ({
            editing: !prevState.editing
        }));
    }

    titleChange(value) {

        this.props.onWidgetEdit({
            id: this.props.id,
            title: value,
            original_title: this.props.originalTitle,
        });
    }

    widgetDelete() {

        this.props.onWidgetDelete(this.props.id);
    }

    submitForm(event) {

        this.props.onItemFormSubmit();
    }

    render() {

        const actions = [
            <LineItemAction
                key="widget-action-edit"
                icon={this.state.editing ? "chevron-up" : "chevron-down"}
                onHandleClick={this.toggleEdit}
            />,
            <LineItemAction
                key="widget-action-delete"
                icon="times"
                classes="cd-editor-lineitem-action-close"
                onHandleClick={this.widgetDelete}
            />
        ];

        const after_title =
                <span className="cd-editor-lineitem-form-originaltitle">
                    {l10n['original_title'] + " "}<strong>{this.props.originalTitle}</strong>
                </span>
            ;

        const form =
                <LineItemForm
                    onSubmit={this.submitForm}
                >
                    <InputText
                        label={l10n['title']}
                        value={this.props.title}
                        placeholder={this.props.originalTitle}
                        onHandleChange={this.titleChange}
                        after={after_title}
                    />
                </LineItemForm>
            ;

        return (
            <LineItemContent
                key={this.props.id}
                title={this.props.title || this.props.originalTitle}
                actions={actions}
                form={this.state.editing ? form : false}
            />
        )
    }
}

/**
 * Secondary actions for panels.
 *
 * @since {{VERSION}}
 */
class SecondaryActions extends React.Component {

    constructor(props) {

        super(props);

        this.loadNextPanel = this.loadNextPanel.bind(this);
        this.loadPreviousPanel = this.loadPreviousPanel.bind(this);
    }

    loadNextPanel() {

        this.props.onLoadPanel(this.props.nextPanel, 'forward');
    }

    loadPreviousPanel() {

        this.props.onLoadPanel(this.props.previousPanel, 'backward');
    }

    render() {
        return (
            <div className="cd-editor-secondary-actions">
                {this.props.title &&
                <div className="cd-editor-panel-actions-title">
                    {this.props.title}
                </div>
                }

                {(this.props.previousPanel || this.props.nextPanel) &&
                <div className="cd-editor-panel-actions-buttons">
                    {this.props.previousPanel &&
                    <ActionButton
                        text={l10n['action_button_back']}
                        icon="chevron-left"
                        align="left"
                        onHandleClick={this.loadPreviousPanel}
                        disabled={this.props.disabled}
                    />
                    }

                    {this.props.nextPanel &&
                    <ActionButton
                        text={this.props.loadNextText}
                        icon="plus"
                        align="right"
                        onHandleClick={this.loadNextPanel}
                        disabled={this.props.disabled}
                    />
                    }
                </div>
                }
            </div>
        )
    }
}


/**
 * Secondary actions for the Primary panel.
 *
 * @since {{VERSION}}
 */
class SecondaryActionsPrimary extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            confirming: false
        }

        this.resetRole = this.resetRole.bind(this);
        this.cancelReset = this.cancelReset.bind(this);
        this.confirmReset = this.confirmReset.bind(this);
    }

    resetRole() {

        if (this.props.deleting) {

            return;
        }

        this.props.onResetRole();

        this.setState({
            confirming: false
        });
    }

    confirmReset() {

        this.props.onConfirmReset();

        this.setState({
            confirming: true,
        });
    }

    cancelReset() {

        this.props.onCancelReset();

        this.setState({
            confirming: false
        });
    }

    render() {

        return (
            <div className="cd-editor-secondary-actions">
                <div className="cd-editor-panel-actions-buttons">

                    {(!this.state.confirming && !this.props.deleting) &&
                    <ActionButton
                        text={l10n['reset_role']}
                        icon="refresh"
                        align="left"
                        type="delete"
                        disabled={this.props.resettable}
                        onHandleClick={this.confirmReset}
                    />}

                    {(this.state.confirming && !this.props.deleting) &&
                    <ActionButton
                        text={l10n['cancel']}
                        icon="ban"
                        align="left"
                        onHandleClick={this.cancelReset}
                    />}

                    {(this.state.confirming || this.props.deleting) &&
                    <ActionButton
                        text={l10n['confirm']}
                        icon={this.props.deleting ? 'circle-o-notch fa-spin' : 'check'}
                        align="right"
                        type="delete"
                        onHandleClick={this.resetRole}
                    />}

                </div>
            </div>
        )
    }
}

/**
 * The Customize preview.
 *
 * @since {{VERSION}}
 */
class Preview extends React.Component {

    constructor(props) {

        super(props);

        this.handleFrameTasks = this.handleFrameTasks.bind(this);
        this.loaded = this.loaded.bind(this);
    }

    shouldComponentUpadte() {

        // iframe should NEVER re-render, because it would refresh
        return false;
    }

    componentDidMount() {

        window.addEventListener('message', this.handleFrameTasks);
    }

    handleFrameTasks(e) {

        if (!e.data.id) {

            return;
        }

        switch (e.data.id) {

            case 'cd_customize_preview_link_clicked' :

                if (!this.isLinkValid(e.data.link)) {

                    this.props.onShowMessage({
                        type: 'error',
                        text: l10n['cannot_view_link']
                    });

                    return;
                }

                var link_base = e.data.link.includes('?') ? e.data.link + '&' : e.data.link + '?';
                var link = link_base + 'cd_customizing=1&role=' + this.props.role;

                this.load(link);

                break;

            case 'cd_customize_preview_form_submit' :

                this.props.onShowMessage({
                    type: 'error',
                    text: l10n['cannot_submit_form']
                });

                break;
        }
    }

    isLinkValid(link) {

        // Not admin
        if (!link.includes('/wp-admin')) {

            return false;
        }

        // Not customizer
        if (link.includes('customize.php')) {

            return false;
        }

        return true;
    }

    loaded() {

        this.props.onLoad();
    }

    getSrc() {

        return adminurl + '?cd_customizing=1&role=' + this.props.role;
    }

    load(url) {

        this.iframe.src = url;
    }

    refresh() {

        // If the iframe contains the "cd_save_role" param, remove it for subsequent loads.
        if (this.iframe.src.includes('&cd_save_role=1')) {

            this.iframe.src = this.getSrc();

        } else {

            this.iframe.contentWindow.location.reload();
        }
    }

    render() {

        return (
            <section id="cd-preview">
                <iframe
                    id="cd-preview-iframe"
                    src={this.getSrc() + (this.props.saveRole ? '&cd_save_role=1' : '')}
                    onLoad={this.loaded}
                    sandbox="allow-scripts allow-forms allow-same-origin"
                    ref={(f) => this.iframe = f}
                />
            </section>
        )
    }
}

/**
 * Shows a message to the user.
 *
 * @since {{VERSION}}
 */
class Message extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            visible: true,
        };

        this.hide = this.hide.bind(this);
    }

    componentWillReceiveProps(nextProps) {

        clearTimeout(this.hideFinish);
        clearTimeout(this.hiding);

        if (nextProps.text) {

            this.setState({
                visible: true
            });
        }
    }

    hide() {

        this.setState({
            visible: false
        });

        // Don't signal parent until animation finishes. This must match animation transition time in CSS.
        this.hideFinish = setTimeout(() => this.props.onHide(), 300);
    }

    render() {

        if (this.state.visible && !this.props.noHide) {

            this.hiding = setTimeout(() => this.hide(), 4000);
        }

        var classes = [
            'cd-editor-message',
            'cd-editor-message-' + this.props.type
        ]

        if (this.props.text && this.state.visible) {

            classes.push('cd-editor-message-visible');
        }

        return (
            <div className={classes.join(' ')}>
                {this.props.text}

                {!this.props.noHide &&
                <span className="cd-editor-message-close dashicons dashicons-no"
                      onClick={this.hide}
                      title={l10n['close']}></span>}
            </div>
        )
    }
}

/**
 * The Customize editor.
 *
 * @since {{VERSION}}
 */
class Editor extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            nextPanel: null,
            panelDirection: 'forward',
            activePanel: 'loading',
            hidden: false,
            submenuEdit: null,
            loadingPreview: false,
            saving: false,
            deleting: false,
            loading: true,
            changes: false,
            message: {
                type: 'default',
                text: null
            },
            customizations: {},
            history: {},
        }

        this.loadPanel = this.loadPanel.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.confirmReset = this.confirmReset.bind(this);
        this.cancelReset = this.cancelReset.bind(this);
        this.resetRole = this.resetRole.bind(this);
        this.resetMessage = this.resetMessage.bind(this);
        this.previewChanges = this.previewChanges.bind(this);
        this.hideCustomizer = this.hideCustomizer.bind(this);
        this.closeCustomizer = this.closeCustomizer.bind(this);
        this.switchRole = this.switchRole.bind(this);
        this.menuItemAdd = this.menuItemAdd.bind(this);
        this.addSubmenuItem = this.addSubmenuItem.bind(this);
        this.menuItemDelete = this.menuItemDelete.bind(this);
        this.deleteSubmenuItem = this.deleteSubmenuItem.bind(this);
        this.submenuEdit = this.submenuEdit.bind(this);
        this.menuItemEdit = this.menuItemEdit.bind(this);
        this.reOrderMenu = this.reOrderMenu.bind(this);
        this.reOrderSubmenu = this.reOrderSubmenu.bind(this);
        this.submenuItemEdit = this.submenuItemEdit.bind(this);
        this.widgetAdd = this.widgetAdd.bind(this);
        this.widgetDelete = this.widgetDelete.bind(this);
        this.widgetEdit = this.widgetEdit.bind(this);
        this.handleEditorClick = this.handleEditorClick.bind(this);
        this.showMessage = this.showMessage.bind(this);
    }

    componentDidMount() {

        var api = this;

        // Confirm before leave
        window.onbeforeunload = function () {

            if (api.state.changes) {

                return l10n['leave_confirmation'];
            }
        };
    }

    loadPanel(panel_ID, direction) {

        direction = direction || 'forward';

        this.setState({
            activePanel: panel_ID,
            panelDirection: direction,
            message: {
                type: 'default',
                text: ''
            }
        });
    }

    hideCustomizer() {

        this.props.onHideCustomizer();
    }

    closeCustomizer() {

        window.location.href = adminurl;
    }

    saveChanges() {

        let api = this;

        this.setState({
            saving: true,
        });

        fetch('wp-json/clientdash/v1/customizations/' + this.props.role, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                menu: this.state.customizations[this.props.role].menu,
                submenu: this.state.customizations[this.props.role].submenu,
                dashboard: this.state.customizations[this.props.role].dashboard
            })
        }).then(function (response) {

            return response.json();

        }).then(function (customizations) {

            api.setState({
                saving: false,
                changes: false,
                message: {
                    type: 'success',
                    text: l10n['saved']
                }
            });

        }).catch(function (error) {

            console.log('error: ', error);
        });
    }

    previewChanges() {

        let api = this;

        clearTimeout(this.refreshingTimeout);

        this.setState({
            loadingPreview: true,
        });

        fetch('wp-json/clientdash/v1/customizations/preview_' + this.props.role, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(this.state.customizations[this.props.role])
        }).then(function (response) {

            return response.json();

        }).then(function (customizations) {

            api.setState({
                loadingPreview: false,
            });

            api.props.refreshPreview();

        }).catch(function (error) {

            console.log('error: ', error);

        });
    }

    confirmReset() {

        this.setState({
            activePanel: 'confirmReset',
            panelDirection: 'forward',
            message: {
                type: 'default',
                text: l10n['confirm_role_reset'],
                noHide: true
            }
        });
    }

    cancelReset() {

        this.setState({
            activePanel: 'primary',
            panelDirection: 'backward',
            message: {
                type: 'default',
                text: ''
            }
        });
    }

    resetRole() {

        var role = this.props.role;
        var api = this;

        this.setState({
            deleting: true,
            activePanel: 'deleting',
            panelDirection: 'forward',
            message: {
                type: 'default',
                text: ''
            }
        });

        fetch('wp-json/clientdash/v1/customizations/' + this.props.role, {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(function (response) {

            return response.json();

        }).then(function (customizations) {

            api.setState((prevState) => {

                prevState.deleting = false;
                prevState.loading = true;
                prevState.changes = false;
                prevState.activePanel = 'loading';
                prevState.panelDirection = 'backward';
                prevState.message = {
                    type: 'success',
                    text: l10n['role_reset']
                };

                delete prevState.customizations[role];

                return prevState;
            });

            api.props.onResetRole(role);

        }).catch(function (error) {

            console.log('error: ', error);
        });
    }

    switchRole(role) {

        this.props.onSwitchRole(role);

        this.setState({
            activePanel: 'loading',
            panelDirection: 'forward',
            loading: true
        });
    }

    loadRole() {

        // Get customizations
        if (!this.state.customizations[this.props.role]) {

            let role = this.props.role;
            let api = this;

            this.setState({
                activePanel: 'loading',
                loading: true
            });

            fetch('wp-json/clientdash/v1/customizations/preview_' + role, {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }).then(function (response) {

                return response.json();

            }).then(function (customizations) {

                api.setState((prevState) => {

                    prevState.activePanel = 'primary';
                    prevState.loading = false;

                    // Get the separators indexed
                    customizations.menu = api.menuIndexItems(customizations.menu);

                    prevState.customizations[role] = customizations;
                    prevState.history[role] = {};

                    return prevState;
                });

            }).catch(function (error) {

                console.log('error: ', error);
            });

        } else if (this.state.activePanel == 'loading') {

            this.setState({
                activePanel: 'primary',
                loading: false
            });
        }
    }

    dataChange(refreshDelay) {

        clearTimeout(this.refreshingTimeout);

        refreshDelay = refreshDelay === false ? 10 : 2000;

        this.refreshingTimeout = setTimeout(() => this.previewChanges(), refreshDelay);

        this.setState({
            changes: true
        });
    }

    resetMessage() {

        this.setState({
            message: {
                text: null
            }
        });
    }

    menuItemAdd(item) {

        let role = this.props.role;

        this.setState((prevState) => {

            let menu = prevState.customizations[role].menu;

            // Separator is added differently
            if (item.id == 'separator') {

                let separator_index = 1;

                // Get new separator index
                menu.map((item) => {

                    if (item.type == 'separator') {

                        separator_index++;
                    }
                });

                menu.unshift({
                    id: "separator" + separator_index,
                    original_title: l10n['separator'],
                    type: 'separator',
                });

                prevState.customizations[role].menu = this.menuIndexItems(menu);
                prevState.history[role].menuItemLastAdded = "separator" + separator_index;

                return prevState;
            }

            // Custom link is added differently
            if (item.id == 'custom_link') {

                let custom_link_index = 1;

                // Get new custom_link index
                menu.map((item) => {

                    if (item.type == 'custom_link') {

                        custom_link_index++;
                    }
                });

                menu.unshift({
                    id: "custom_link" + custom_link_index,
                    original_title: l10n['custom_link'],
                    icon: 'dashicons-admin-generic',
                    type: 'custom_link',
                });

                prevState.customizations[role].menu = this.menuIndexItems(menu);
                prevState.history[role].menuItemLastAdded = "custom_link" + custom_link_index;

                return prevState;
            }

            prevState.customizations[role].menu = modifyItem(menu, item.id, {deleted: false});

            // Move to beginning
            prevState.customizations[role].menu = arrayMove(
                prevState.customizations[role].menu,
                getItemIndex(prevState.customizations[role].menu, item.id),
                0
            );

            prevState.history[role].menuItemLastAdded = item.id;

            return prevState;
        });

        this.dataChange(false);

        this.loadPanel('menu', 'backward');
    }

    addSubmenuItem(item) {

        let submenu_edit = this.state.submenuEdit;
        let role = this.props.role;

        this.setState((prevState) => {

            prevState.customizations[role].submenu[submenu_edit] = modifyItem(
                prevState.customizations[role].submenu[submenu_edit],
                item.id,
                {deleted: false}
            );

            // Move to beginning
            prevState.customizations[role].submenu[submenu_edit] = arrayMove(
                prevState.customizations[role].submenu[submenu_edit],
                getItemIndex(prevState.customizations[role].submenu[submenu_edit], item.id),
                0
            );

            return prevState;
        });

        this.dataChange(false);

        this.loadPanel('submenu', 'backward');
    }

    menuItemDelete(ID) {

        let role = this.props.role;

        this.setState((prevState) => {

            let item = getItem(prevState.customizations[role].menu, ID);

            // Separator is added differently
            if (item.type == 'separator' || item.type == 'custom_link') {

                let items = deleteItem(prevState.customizations[role].menu, ID);

                prevState.customizations[role].menu = this.menuIndexItems(items);

                return prevState;
            }

            prevState.customizations[role].menu = modifyItem(
                prevState.customizations[role].menu,
                ID,
                {deleted: true}
            );

            return prevState;
        });

        this.dataChange(false);
    }


    deleteSubmenuItem(ID) {

        let submenu_edit = this.state.submenuEdit;
        let role = this.props.role;

        this.setState((prevState) => {

            prevState.customizations[role].submenu[submenu_edit] = modifyItem(
                prevState.customizations[role].submenu[submenu_edit],
                ID,
                {deleted: true}
            )

            return prevState;
        });

        this.dataChange(false);
    }

    submenuEdit(ID) {

        this.setState({
            submenuEdit: ID
        });

        this.loadPanel('submenu', 'forward');
    }

    menuItemEdit(item) {

        let role = this.props.role;

        this.setState((prevState) => {

            prevState.customizations[role].menu = modifyItem(
                prevState.customizations[role].menu,
                item.id,
                item
            );

            return prevState;
        });

        this.dataChange();
    }

    submenuItemEdit(item) {

        let submenu_edit = this.state.submenuEdit;
        let role = this.props.role;

        this.setState((prevState) => {

            prevState.customizations[role].submenu[submenu_edit] = modifyItem(
                prevState.customizations[role].submenu[submenu_edit],
                item.id,
                item
            );

            return prevState;
        });

        this.dataChange();
    }

    reOrderMenu(new_order) {

        let role = this.props.role;

        new_order = this.menuIndexItems(new_order);

        this.setState((prevState) => {

            prevState.customizations[role].menu = new_order;

            return prevState;
        });

        this.dataChange(false);
    }

    reOrderSubmenu(new_order) {

        let submenu_edit = this.state.submenuEdit;
        let role = this.props.role;

        this.setState((prevState) => {

            prevState.customizations[role].submenu[submenu_edit] = new_order;

            return prevState;
        });

        this.dataChange(false);
    }

    menuIndexItems(menu) {

        let separator_index = 1;
        let custom_link_index = 1;
        let new_menu = [];

        menu.map((item) => {

            if (item.type == 'separator') {

                item.id = 'separator' + separator_index;

                separator_index++;

            } else if (item.type == 'custom_link') {

                item.id = 'custom_link' + custom_link_index;

                custom_link_index++;
            }

            new_menu.push(item);
        });

        return new_menu;
    }

    widgetAdd(widget) {

        let role = this.props.role;

        this.setState((prevState) => {

            prevState.customizations[role].dashboard = modifyItem(
                prevState.customizations[role].dashboard,
                widget.id,
                {deleted: false}
            );

            return prevState;
        });

        this.dataChange(false);

        this.loadPanel('dashboard', 'backward');
    }

    widgetDelete(ID) {

        let role = this.props.role;

        this.setState((prevState) => {

            prevState.customizations[role].dashboard = modifyItem(
                prevState.customizations[role].dashboard,
                ID,
                {deleted: true}
            );

            return prevState;
        });

        this.dataChange(false);
    }

    widgetEdit(widget) {

        let role = this.props.role;

        this.setState((prevState) => {

            prevState.customizations[role].dashboard = modifyItem(
                prevState.customizations[role].dashboard,
                widget.id,
                widget
            );

            return prevState;
        });

        this.dataChange();
    }

    handleEditorClick() {

        if (!this.state.message.noHide) {

            this.resetMessage();
        }
    }

    showMessage(message) {

        this.setState({
            message: message
        });
    }

    render() {

        var customizations = this.state.customizations[this.props.role];
        var panel;
        var secondary_actions;
        var history = this.state.history[this.props.role] || {};

        switch (this.state.activePanel) {

            case 'primary':
            case 'confirmReset':
            case 'deleting':
            {
                panel =
                    <PanelPrimary
                        key="primary"
                        onLoadPanel={this.loadPanel}
                    />
                ;
                secondary_actions =
                    <SecondaryActionsPrimary
                        key="primary"
                        onResetRole={this.resetRole}
                        onConfirmReset={this.confirmReset}
                        onCancelReset={this.cancelReset}
                        deleting={this.state.deleting}
                        disabled={this.state.saving || this.state.deleting}
                    />
                ;
                break;
            }
            case 'menu':
            {

                let current_items = customizations.menu;
                let available_items = getAvailableItems(current_items);

                panel =
                    <PanelMenu
                        key="menu"
                        menuItems={available_items}
                        lastAdded={history.menuItemLastAdded || false}
                        onMenuItemEdit={this.menuItemEdit}
                        onDeleteItem={this.menuItemDelete}
                        onSubmenuEdit={this.submenuEdit}
                        onReOrderMenu={this.reOrderMenu}
                        onItemSubmitForm={this.previewChanges}
                    />
                ;
                secondary_actions =
                    <SecondaryActions
                        key="menu"
                        title={l10n['panel_actions_title_menu']}
                        previousPanel="primary"
                        nextPanel="addMenuItems"
                        loadNextText={l10n['action_button_add_items']}
                        onLoadPanel={this.loadPanel}
                        disabled={this.state.saving || this.state.deleting}
                    />
                ;
                break;
            }
            case 'submenu':
            {

                let current_items = customizations.submenu[this.state.submenuEdit] || [];
                let available_items = getAvailableItems(current_items);
                let menu_item = getItem(customizations.menu, this.state.submenuEdit);
                let item_info =
                        <div className="cd-editor-panel-menuinfo">
                            <span className={"cd-editor-panel-menuinfo-icon dashicons " + menu_item.icon}></span>
                                <span className="cd-editor-panel-menuinfo-title">
                                    {menu_item.title || menu_item.original_title}
                                </span>
                        </div>
                    ;

                panel =
                    <PanelSubmenu
                        key="submenu"
                        itemInfo={item_info}
                        onSubmenuItemEdit={this.submenuItemEdit}
                        submenuItems={available_items}
                        onDeleteItem={this.deleteSubmenuItem}
                        onReOrderSubmenu={this.reOrderSubmenu}
                        onItemSubmitForm={this.previewChanges}
                    />
                ;
                secondary_actions =
                    <SecondaryActions
                        key="submenu"
                        title={l10n['panel_actions_title_submenu']}
                        nextPanel="addSubmenuItems"
                        previousPanel="menu"
                        loadNextText={l10n['action_button_add_items']}
                        onLoadPanel={this.loadPanel}
                        disabled={this.state.saving || this.state.deleting}
                    />
                ;
                break;
            }
            case 'addMenuItems':
            {

                let current_items = customizations.menu;
                let available_items = getDeletedItems(current_items);

                available_items = setToOriginalTitles(available_items);

                // Skip separators
                available_items = available_items.filter((item) => {

                    return item.type != 'separator';
                });

                // Add custom link
                available_items.push({
                    id: 'custom_link',
                    title: l10n['custom_link'],
                    type: 'custom_link',
                });

                // Add separator to bottom always
                available_items.push({
                    id: 'separator',
                    title: l10n['separator'],
                    type: 'separator',
                });

                panel =
                    <PanelAddItems
                        key="addMenuItems"
                        availableItems={available_items}
                        onAddItem={this.menuItemAdd}
                    />
                ;
                secondary_actions =
                    <SecondaryActions
                        key="addMenuItems"
                        title={l10n['panel_actions_title_menu_add']}
                        previousPanel="menu"
                        onLoadPanel={this.loadPanel}
                        disabled={this.state.saving || this.state.deleting}
                    />
                ;
                break;
            }
            case 'addSubmenuItems':
            {
                let menu_item = getItem(customizations.menu,this.state.submenuEdit);
                let item_info =
                        <div className="cd-editor-panel-menuinfo">
                            <span className={"cd-editor-panel-menuinfo-icon dashicons " + menu_item.icon}></span>
                                <span className="cd-editor-panel-menuinfo-title">
                                    {menu_item.title || menu_item.original_title}
                                </span>
                        </div>
                    ;
                let current_items = customizations.submenu[this.state.submenuEdit] || [];
                let available_items = getDeletedItems(current_items);

                available_items = setToOriginalTitles(available_items);

                panel =
                    <PanelAddItems
                        key="addSubmenuItems"
                        itemInfo={item_info}
                        availableItems={available_items}
                        onAddItem={this.addSubmenuItem}
                    />
                ;
                secondary_actions =
                    <SecondaryActions
                        key="addSubmenuItems"
                        title={l10n['panel_actions_title_submenu_add']}
                        previousPanel="submenu"
                        onLoadPanel={this.loadPanel}
                        disabled={this.state.saving || this.state.deleting}
                    />
                ;
                break;
            }
            case 'dashboard':
            {

                let current_items = customizations.dashboard;
                let available_items = getAvailableItems(current_items);

                panel =
                    <PanelDashboard
                        key="dashboard"
                        widgets={available_items}
                        onWidgetEdit={this.widgetEdit}
                        onDeleteWidget={this.widgetDelete}
                        onLoadPanel={this.loadPanel}
                        onItemSubmitForm={this.previewChanges}
                    />
                ;
                secondary_actions =
                    <SecondaryActions
                        key="dashboard"
                        title={l10n['panel_actions_title_dashboard']}
                        previousPanel="primary"
                        nextPanel="addWidgets"
                        loadNextText={l10n['action_button_add_items']}
                        onLoadPanel={this.loadPanel}
                        disabled={this.state.saving || this.state.deleting}
                    />
                ;
                break;
            }
            case 'addWidgets':
            {

                let current_items = customizations.dashboard;
                let available_items = getDeletedItems(current_items);

                available_items = setToOriginalTitles(available_items);

                panel =
                    <PanelAddItems
                        key="addWidgets"
                        availableItems={available_items}
                        onAddItem={this.widgetAdd}
                    />
                ;
                secondary_actions =
                    <SecondaryActions
                        key="addWidgets"
                        title={l10n['panel_actions_title_dashboard_add']}
                        previousPanel="dashboard"
                        onLoadPanel={this.loadPanel}
                        disabled={this.state.saving || this.state.deleting}
                    />
                ;
                break;
            }

            case 'loading':
            {

                panel =
                    <PanelLoading
                        key="loading"
                    />
                ;
                secondary_actions =
                    <SecondaryActions
                        key="loading"
                    />
                ;
                break;
            }

            case 'blank':
            {

                panel =
                    <PanelBlank
                        key="blank"
                    />
                ;
                secondary_actions =
                    <SecondaryActions
                        key="blank"
                    />
                ;
                break;
            }
        }

        if (this.state.activePanel == 'confirmReset' || this.state.activePanel == 'deleting') {

            panel =
                <PanelBlank
                    key="blank"
                />
            ;
        }

        return (
            <div id="cd-editor">

                <div className="cd-editor-header">
                    <PrimaryActions
                        onSaveChanges={this.saveChanges}
                        onPreviewChanges={this.previewChanges}
                        onHideCustomizer={this.hideCustomizer}
                        onCloseCustomizer={this.closeCustomizer}
                        loadingPreview={this.state.loadingPreview}
                        saving={this.state.saving}
                        disabled={this.state.deleting || this.state.loading}
                        changes={this.state.changes}
                    />

                    <RoleSwitcher
                        role={this.props.role}
                        disabled={this.state.saving || this.state.deleting || this.state.loading}
                        onSwitchRole={this.switchRole}
                    />

                    <Message
                        text={this.state.message.text || ''}
                        type={this.state.message.type || 'default'}
                        noHide={this.state.message.noHide || false}
                        onHide={this.resetMessage}
                    />
                </div>

                <div className="cd-editor-panels" onClick={this.handleEditorClick}>
                    <ReactCSSTransitionReplace
                        transitionName={"panel-" + this.state.panelDirection}
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={300}>
                        {panel}
                    </ReactCSSTransitionReplace>
                </div>

                <div className="cd-editor-footer">
                    <ReactCSSTransitionReplace
                        transitionName={"panel-" + this.state.panelDirection}
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={300}>
                        {secondary_actions}
                    </ReactCSSTransitionReplace>
                </div>

            </div>
        );
    }
}

/**
 * The main Customize component.
 *
 * @since {{VERSION}}
 */
class Customize extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            hidden: false,
            role: 'administrator',
            loadedRoles: ['administrator'],
            saveRole: true,
            previewLoading: true,
        }

        this.hideCustomizer = this.hideCustomizer.bind(this);
        this.showCustomizer = this.showCustomizer.bind(this);
        this.switchRole = this.switchRole.bind(this);
        this.resetRole = this.resetRole.bind(this);
        this.loadData = this.loadData.bind(this);
        this.refreshPreview = this.refreshPreview.bind(this);
        this.showMessage = this.showMessage.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {

        // Don't reload if setting saveRole to false
        if (this.state.saveRole === true && nextState.saveRole === false) {

            return false;
        }

        return true;
    }

    hideCustomizer() {

        this.setState({
            hidden: true,
        });
    }

    showCustomizer() {

        this.setState({
            hidden: false,
        });
    }

    resetRole(role) {

        console.log('resetting');

        this.setState((prevState) => {

            prevState.saveRole = true;
            prevState.previewLoading = true;
            prevState.role = role;
            prevState.saveRole = true;

            return prevState;
        });

        this.refs.preview.load(adminurl + '?cd_customizing=1&cd_save_role=1&role=' + role);
    }

    switchRole(role) {

        if (this.state.loadedRoles.indexOf(role) === -1) {

            this.setState((prevState) => {

                prevState.role = role;
                prevState.saveRole = true;
                prevState.loadedRoles.push(role);

                return prevState;
            });

        } else {

            this.setState({
                role: role
            });
        }
    }

    loadData() {

        this.setState({
            previewLoading: false,
            saveRole: this.state.saveRole || false,
        });

        this.refs.editor.loadRole();
    }

    refreshPreview() {

        this.setState({
            previewLoading: true,
        });

        this.refs.preview.refresh();
    }

    showMessage(message) {

        this.refs.editor.showMessage(message);
    }

    render() {

        return (
            <div className={"cd-customize-container " + (this.state.hidden ? "hidden" : "")}>
                {this.state.hidden &&
                <button type="button" className="cd-customize-show"
                        title={l10n['show_controls']} onClick={this.showCustomizer}>
                    <span className="cd-customize-show-icon fa fa-chevron-circle-right"/>
                </button>
                }

                <Editor
                    onHideCustomizer={this.hideCustomizer}
                    onSwitchRole={this.switchRole}
                    onResetRole={this.resetRole}
                    refreshPreview={this.refreshPreview}
                    role={this.state.role}
                    ref="editor"
                />

                <Preview
                    role={this.state.role}
                    onLoad={this.loadData}
                    saveRole={this.state.saveRole}
                    onShowMessage={this.showMessage}
                    ref="preview"
                />

                {this.state.previewLoading &&
                <div id="cd-editor-preview-cover">
                    <span className="cd-editor-preview-cover-icon fa fa-circle-o-notch fa-spin"/>
                </div>}
            </div>
        )
    }
}

// Renders the Customizer
ReactDOM.render(
    <Customize />,
    document.getElementById('clientdash-customize')
);