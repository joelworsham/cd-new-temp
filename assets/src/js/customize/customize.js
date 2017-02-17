import React from 'react';
import ReactDOM from 'react-dom';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

const l10n = ClientdashCustomize_Data.l10n || false;
const roles = ClientdashCustomize_Data.roles || false;
const adminurl = ClientdashCustomize_Data.adminurl || false;
const dashicons = ClientdashCustomize_Data.dashicons || false;

/**
 * Returns all items marked "deleted" from a list.
 *
 * @since {{VERSION}}
 *
 * @param {{}} items
 * @returns {{}}
 */
const getDeletedItems = function (items) {

    var deleted_items = {};

    Object.keys(items).forEach((ID) => {

        let item = items[ID];

        if (item.deleted) {

            deleted_items[ID] = item;
        }
    });

    return deleted_items;
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

    var available_items = {};

    Object.keys(items).forEach((ID) => {

        let item = items[ID];

        if (!item.deleted) {

            available_items[ID] = item;
        }
    });

    return available_items;
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

    Object.keys(items).map((ID) => {

        let item = items[ID];

        item.title = item.original_title;
    });

    return items;
}

/**
 * Re-orders the object for the sortable event.
 *
 * @since {{VERSION}}
 *
 * @param object
 * @param old_index
 * @param new_index
 * @returns {{}}
 */
const sortableReOrder = function (object, old_index, new_index) {

    // Convert object to an array, so we can sort it
    var sortable = [];
    Object.keys(object).map((ID) => {

        let item = object[ID];

        item.ID = ID;

        sortable.push(item);
    });

    // Sort it
    sortable = arrayMove(sortable, old_index, new_index);

    // Convert back to an object and send off to parent state
    var new_order = {};
    sortable.map((item) => {

        let ID = item.ID;

        delete item.ID;

        new_order[ID] = item;
    });

    return new_order;
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
                    >
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
                    {l10n.icon}
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

        this.props.onHandleClick();
    }

    render() {
        return (
            <button type="button"
                    className={"cd-editor-action-button " + (this.props.align ? this.props.align : "")}
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
                type="button"
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
    render() {
        return (
            <form className="cd-editor-lineitem-form">
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
            <div id={"cd-editor-lineitem-" + this.props.id} className={"cd-editor-lineitem " + this.props.classes}>
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
            <li className="cd-editor-lineitem-li">{this.props.children}</li>
        )
    }
}

/**
 * Sortable line item wrapper.
 *
 * @since {{VERSION}}
 */
const SortableLineItem = SortableElement(({item}) => <li className="cd-editor-lineitem-li">{item}</li>);

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
                    <LineItem key={`item-${index}`}>
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
                <SortableLineItem key={`item-${index}`} index={index} item={item}/>
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
            //title: this.props.title,
            //icon: this.props.icon
        }

        this.toggleEdit = this.toggleEdit.bind(this);
        this.titleChange = this.titleChange.bind(this);
        this.iconChange = this.iconChange.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.submenuEdit = this.submenuEdit.bind(this);
    }

    toggleEdit() {

        this.setState((prevState) => ({
            editing: !prevState.editing
        }));
    }

    titleChange(value) {

        this.props.onMenuItemEdit(this.props.id, {
            icon: this.props.icon,
            title: value,
            original_title: this.props.originalTitle,
        });
    }

    iconChange(value) {

        this.props.onMenuItemEdit(this.props.id, {
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

    render() {

        var actions = [
            <LineItemAction
                key="menu-action-submenu"
                icon="th-list"
                onHandleClick={this.submenuEdit}
            />,
            <LineItemAction
                key="menu-action-edit"
                icon={this.state.editing ? "chevron-up" : "chevron-down"}
                onHandleClick={this.toggleEdit}
            />
        ];

        if (this.props.id != 'cd_settings') {

            actions.push(
                <LineItemAction
                    key="menu-action-delete"
                    icon="times"
                    classes="cd-editor-lineitem-action-close"
                    onHandleClick={this.deleteItem}
                />
            );
        }

        const after_title =
                <span className="cd-editor-lineitem-form-originaltitle">
                    {l10n.original_title + " "}<strong>{this.props.originalTitle}</strong>
                </span>
            ;

        const form =
                <LineItemForm>
                    <InputText
                        label={l10n.title}
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
                form={this.state.editing ? form : false}
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
                title={l10n.separator}
                classes="cd-editor-menuitem-separator"
                actions={actions}
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
    }

    toggleEdit() {

        this.setState((prevState) => ({
            editing: !prevState.editing
        }));
    }

    titleChange(value) {

        this.props.onSubmenuItemEdit(this.props.id, {
            title: value,
            original_title: this.props.originalTitle,
        });
    }

    deleteItem() {

        this.props.onDeleteItem(this.props.id);
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
                    {l10n.original_title + " "}<strong>{this.props.originalTitle}</strong>
                </span>
            ;

        const form =
                <LineItemForm>
                    <InputText
                        label={l10n.title}
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
 * Line item for adding a menu item.
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
        this.props.onAddItem(this.props.id, {
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
            <div className="cd-editor-panel">
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
                    onHandleClick={this.hideCustomizer}
                />
                <ActionButton
                    text="Close"
                    icon="times"
                    onHandleClick={this.closeCustomizer}
                />
                <ActionButton
                    text="Preview"
                    icon="eye"
                    onHandleClick={this.previewChanges}
                />
                <ActionButton
                    text="Save"
                    icon="check"
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
                    label={l10n.role_switcher_label}
                    selected={this.props.role}
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

        this.onLoadPanel = this.onLoadPanel.bind(this);
    }

    onLoadPanel(panel_ID) {

        this.props.onLoadPanel(panel_ID);
    }

    render() {
        return (
            <Panel>
                <PanelLoadButton
                    text={l10n.panel_text_menu}
                    target="menu"
                    onLoadPanel={this.onLoadPanel}
                />
                <PanelLoadButton
                    text={l10n.panel_text_dashboard}
                    target="dashboard"
                    onLoadPanel={this.onLoadPanel}
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
    }

    onSortEnd(args) {

        var new_order = sortableReOrder(this.props.menuItems, args.oldIndex, args.newIndex);

        this.props.onReOrderMenu(new_order);
    }

    deleteItem(ID) {

        this.props.onDeleteItem(ID);
    }

    menuItemEdit(ID, item) {

        this.props.onMenuItemEdit(ID, item);
    }

    submenuEdit(ID) {

        this.props.onSubmenuEdit(ID);
    }

    render() {

        var menu_items = [];
        var panel_contents;

        if (Object.keys(this.props.menuItems).length) {

            Object.keys(this.props.menuItems).map((ID) => {

                let item = this.props.menuItems[ID];

                if (item.separator) {

                    var menu_item =
                            <MenuItemSeparator
                                key={ID}
                                id={ID}
                                onDeleteItem={this.deleteItem}
                            />
                        ;

                } else {

                    var menu_item =
                            <MenuItemEdit
                                key={ID}
                                id={ID}
                                title={item.title}
                                originalTitle={item.original_title}
                                icon={item.icon}
                                hasSubmenu={item.hasSubmenu}
                                onMenuItemEdit={this.menuItemEdit}
                                onSubmenuEdit={this.submenuEdit}
                                onDeleteItem={this.deleteItem}
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
                    {l10n.no_items_added}
                </div>
        }

        return (
            <Panel>
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
    }

    onSortEnd(args) {

        var new_order = sortableReOrder(this.props.submenuItems, args.oldIndex, args.newIndex);

        this.props.onReOrderSubmenu(new_order);
    }

    deleteItem(item_id) {

        this.props.onDeleteItem(item_id);
    }

    submenuItemEdit(ID, item) {

        this.props.onSubmenuItemEdit(ID, item);
    }

    render() {

        var menu_items = [];
        var panel_contents;

        if (Object.keys(this.props.submenuItems).length) {

            Object.keys(this.props.submenuItems).map((ID) => {

                let item = this.props.submenuItems[ID];

                menu_items.push(
                    <SubmenuItemEdit
                        key={ID}
                        id={ID}
                        title={item.title}
                        onSubmenuItemEdit={this.submenuItemEdit}
                        originalTitle={item.original_title}
                        onDeleteItem={this.deleteItem}
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
                    {l10n.no_items_added}
                </div>
        }

        return (
            <Panel>
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

    addItem(ID, item) {

        this.props.onAddItem(ID, item);
    }

    render() {

        var menu_items = [];
        var panel_contents;

        if (Object.keys(this.props.availableItems).length) {

            //let items = this.props.availableItems;

            Object.keys(this.props.availableItems).map((ID) => {

                let item = this.props.availableItems[ID];

                menu_items.push(
                    <ItemAdd
                        key={ID}
                        id={ID}
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
                    {l10n.no_items_available}
                </div>
            ;
        }

        return (
            <Panel>
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
    }

    widgetDelete(ID) {

        this.props.onDeleteWidget(ID);
    }

    widgetEdit(ID, widget) {

        this.props.onWidgetEdit(ID, widget);
    }

    render() {

        var widgets = [];
        var panel_contents;

        if (Object.keys(this.props.widgets).length) {

            Object.keys(this.props.widgets).map((ID) => {

                let item = this.props.widgets[ID];

                widgets.push(
                    <WidgetEdit
                        key={ID}
                        id={ID}
                        title={item.title}
                        originalTitle={item.original_title}
                        onWidgetEdit={this.widgetEdit}
                        onWidgetDelete={this.widgetDelete}
                    />
                );
            });

            panel_contents =
                <LineItems items={widgets}/>
            ;

        } else {

            panel_contents =
                <div className="cd-editor-panel-helptext">
                    {l10n.no_items_added}
                </div>
        }

        return (
            <Panel>
                {panel_contents}
            </Panel>
        )
    }
}

class PanelLoading extends React.Component {
    render() {

        return (
            <Panel>
                Loading...
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
    }

    toggleEdit() {

        this.setState((prevState) => ({
            editing: !prevState.editing
        }));
    }

    titleChange(value) {

        this.props.onWidgetEdit(this.props.id, {
            title: value,
            original_title: this.props.originalTitle,
        });
    }

    widgetDelete() {

        this.props.onWidgetDelete(this.props.id);
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
                    {l10n.original_title + " "}<strong>{this.props.originalTitle}</strong>
                </span>
            ;

        const form =
                <LineItemForm>
                    <InputText
                        label={l10n.title}
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
 * Panel specific actions for Menu.
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

        this.props.onLoadPanel(this.props.nextPanel);
    }

    loadPreviousPanel() {

        this.props.onLoadPanel(this.props.previousPanel);
    }

    render() {
        return (
            <div className="cd-editor-secondary-actions">
                {this.props.title &&
                <div className="cd-editor-panel-actions-title">
                    {this.props.title}
                </div>
                }

                <div className="cd-editor-panel-actions-buttons">
                    {this.props.previousPanel &&
                    <ActionButton
                        text={l10n.action_button_back}
                        icon="chevron-left"
                        align="left"
                        onHandleClick={this.loadPreviousPanel}
                    />
                    }

                    {this.props.nextPanel &&
                    <ActionButton
                        text={this.props.loadNextText}
                        icon="plus"
                        align="right"
                        onHandleClick={this.loadNextPanel}
                    />
                    }
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

        this.loaded = this.loaded.bind(this);
    }

    componentWillUpdate() {

        if (!this.props.initial) {

            document.getElementById('cd-preview-iframe').contentWindow.location.reload();
        }
    }

    handleClick(e) {

        console.log(e);
    }

    loaded() {

        this.props.onLoad();
    }

    getSrc() {

        return adminurl + '?cd_customizing=1&role=' + this.props.role;
    }

    refresh() {

        // If the iframe contains the "cd_save_role" param, remove it for subsequent loads.
        if (document.getElementById('cd-preview-iframe').src.includes('&cd_save_role=1')) {

            document.getElementById('cd-preview-iframe').src = this.getSrc();

        } else {

            document.getElementById('cd-preview-iframe').contentWindow.location.reload();
        }
    }

    render() {
        return (
            <section id="cd-preview">
                <iframe
                    id="cd-preview-iframe"
                    src={this.getSrc() + (this.props.saveRole ? '&cd_save_role=1' : '')}
                    onLoad={this.loaded}
                    onClick={this.handleClick}
                />
            </section>
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
            activePanel: 'loading', // TODO set to "primary"
            hidden: false,
            submenuEdit: null,
            customizations: {},
        }

        this.loadPanel = this.loadPanel.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
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
    }

    loadPanel(panel_ID) {

        this.setState({
            activePanel: panel_ID
        });
    }

    hideCustomizer() {

        this.props.onHideCustomizer();
    }

    closeCustomizer() {

        window.location.href = adminurl;
    }

    previewChanges() {

        let api = this;

        console.log('previewing...');

        fetch('wp-json/clientdash/v1/customizations/preview_' + this.props.role, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(this.state.customizations[this.props.role])
        }).then(function (response) {

            //console.log(response);

            return response.json();

        }).then(function (customizations) {

            console.log('status: ', customizations);

            api.props.refreshPreview();

        }).catch(function (error) {

            console.log('error: ', error);

        });
    }

    switchRole(role) {

        this.props.onSwitchRole(role);
        this.state.activePanel = 'loading';
    }

    loadRole() {

        // Get customizations
        if (!this.state.customizations[this.props.role]) {

            let role = this.props.role;
            let api = this;

            fetch('wp-json/clientdash/v1/customizations/preview_' + role, {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }).then(function (response) {

                return response.json();

            }).then(function (customizations) {

                api.setState((prevState) => {

                    let state = prevState;

                    state.activePanel = 'primary';

                    // Get the separators indexed
                    customizations.menu = api.menuIndexSeparators(customizations.menu);

                    state.customizations[role] = customizations;

                    return state;
                });

            }).catch(function (error) {

                console.log('error: ', error);

            });

        } else if (this.state.activePanel == 'loading') {

            this.setState({
                activePanel: 'primary',
            });
        }
    }

    saveChanges() {

        console.log('saving...');

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

            //console.log(response);

            return response.json();

        }).then(function (customizations) {

            console.log('status: ', customizations);

        }).catch(function (error) {

            console.log('error: ', error);

        });
    }

    menuItemAdd(ID, item) {

        let role = this.props.role;

        this.setState((prevState) => {

            let menu = prevState.customizations[role].menu;

            // Separator is added differently
            if (ID == 'separator') {

                let separator_index = 1;

                // Get new separator index
                Object.keys(menu).map((ID) => {

                    let item = menu[ID];

                    if (item.separator) {

                        separator_index++;
                    }
                });

                menu["separator" + separator_index] = {
                    original_title: l10n.separator,
                    separator: true,
                };

                prevState.customizations[role].menu = this.menuIndexSeparators(prevState.customizations[role].menu);

                return prevState;
            }

            menu[ID].deleted = false;

            return prevState;
        });

        this.loadPanel('menu');
    }

    addSubmenuItem(ID, item) {

        let submenu_edit = this.state.submenuEdit;
        let role = this.props.role;

        this.setState((prevState) => {

            prevState.customizations[role].submenu[submenu_edit][ID].deleted = false;

            return prevState;
        });

        this.loadPanel('submenu');
    }

    menuItemDelete(ID) {

        let role = this.props.role;

        this.setState((prevState) => {

            let item = prevState.customizations[role].menu[ID];

            // Separator is added differently
            if (item.separator) {

                delete prevState.customizations[role].menu[ID];

                prevState.customizations[role].menu = this.menuIndexSeparators(prevState.customizations[role].menu);

                return prevState;
            }

            item.deleted = true;

            return prevState;
        });
    }

    deleteSubmenuItem(ID) {

        let submenu_edit = this.state.submenuEdit;
        let role = this.props.role;

        this.setState((prevState) => {

            prevState.customizations[role].submenu[submenu_edit][ID].deleted = true;

            return prevState;
        });
    }

    submenuEdit(ID) {

        this.setState({
            submenuEdit: ID
        });

        this.loadPanel('submenu');
    }

    menuItemEdit(ID, item) {

        let role = this.props.role;

        this.setState((prevState) => {

            prevState.customizations[role].menu[ID] = item;

            return prevState;
        });
    }

    reOrderMenu(new_order) {

        let role = this.props.role;

        new_order = this.menuIndexSeparators(new_order);

        this.setState((prevState) => {

            prevState.customizations[role].menu = new_order;

            return prevState;
        });
    }

    reOrderSubmenu(new_order) {

        let submenu_edit = this.state.submenuEdit;
        let role = this.props.role;

        this.setState((prevState) => {

            prevState.customizations[role].submenu[submenu_edit] = new_order;

            return prevState;
        });
    }

    submenuItemEdit(ID, item) {

        let submenu_edit = this.state.submenuEdit;
        let role = this.props.role;

        this.setState((prevState) => {

            prevState.customizations[role].submenu[submenu_edit][ID] = item;

            return prevState;
        });
    }

    menuIndexSeparators(menu) {

        let separator_index = 1;
        let new_menu = {};

        Object.keys(menu).map((ID) => {

            let item = menu[ID];

            if (item.separator) {

                new_menu['separator' + separator_index] = {
                    original_title: l10n.separator,
                    separator: true,
                }

                separator_index++;

            } else {

                new_menu[ID] = item;
            }
        });

        return new_menu;
    }

    widgetAdd(ID, widget) {

        let role = this.props.role;

        this.setState((prevState) => {

            prevState.customizations[role].dashboard[ID].deleted = false;

            return prevState;
        });

        this.loadPanel('dashboard');
    }

    widgetDelete(ID) {

        let role = this.props.role;

        this.setState((prevState) => {

            prevState.customizations[role].dashboard[ID].deleted = true;

            return prevState;
        });
    }

    widgetEdit(ID, widget) {

        let role = this.props.role;

        this.setState((prevState) => {

            prevState.customizations[role].dashboard[ID] = (widget);

            return prevState;
        });
    }

    render() {

        var customizations = this.state.customizations[this.props.role];

        switch (this.state.activePanel) {

            case 'primary':
            {

                var panel =
                        <PanelPrimary
                            onLoadPanel={this.loadPanel}
                        />
                    ;
                var secondary_actions =
                        <SecondaryActions />
                    ;
                break;
            }
            case 'menu':
            {

                let current_items = customizations.menu;
                let available_items = getAvailableItems(current_items);

                var panel =
                        <PanelMenu
                            menuItems={available_items}
                            onMenuItemEdit={this.menuItemEdit}
                            onDeleteItem={this.menuItemDelete}
                            onLoadPanel={this.loadPanel}
                            onSubmenuEdit={this.submenuEdit}
                            onReOrderMenu={this.reOrderMenu}
                        />
                    ;
                var secondary_actions =
                        <SecondaryActions
                            title={l10n.panel_actions_title_menu}
                            previousPanel="primary"
                            nextPanel="addMenuItems"
                            loadNextText={l10n.action_button_add_items}
                            onLoadPanel={this.loadPanel}
                        />
                    ;
                break;
            }
            case 'submenu':
            {

                let current_items = customizations.submenu[this.state.submenuEdit] || [];
                let available_items = getAvailableItems(current_items);
                let menu_item = customizations.menu[this.state.submenuEdit];
                let item_info =
                        <div className="cd-editor-panel-menuinfo">
                            <span className={"cd-editor-panel-menuinfo-icon dashicons " + menu_item.icon}></span>
                                <span className="cd-editor-panel-menuinfo-title">
                                    {menu_item.title || menu_item.original_title}
                                </span>
                        </div>
                    ;

                var panel =
                        <PanelSubmenu
                            itemInfo={item_info}
                            onSubmenuItemEdit={this.submenuItemEdit}
                            submenuItems={available_items}
                            onDeleteItem={this.deleteSubmenuItem}
                            onLoadPanel={this.loadPanel}
                            onReOrderSubmenu={this.reOrderSubmenu}
                        />
                    ;
                var secondary_actions =
                        <SecondaryActions
                            title={l10n.panel_actions_title_submenu}
                            nextPanel="addSubmenuItems"
                            previousPanel="menu"
                            loadNextText={l10n.action_button_add_items}
                            onLoadPanel={this.loadPanel}
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
                Object.keys(available_items).map((ID) => {

                    let item = available_items[ID];

                    if (item.separator) {

                        delete available_items[ID];
                    }
                });

                // Add separator to bottom always
                available_items.separator = {
                    title: l10n.separator,
                    separator: true,
                }

                var panel =
                        <PanelAddItems
                            availableItems={available_items}
                            onAddItem={this.menuItemAdd}
                        />
                    ;
                var secondary_actions =
                        <SecondaryActions
                            title={l10n.panel_actions_title_menu_add}
                            previousPanel="menu"
                            onLoadPanel={this.loadPanel}
                        />
                    ;
                break;
            }
            case 'addSubmenuItems':
            {
                let menu_item = customizations.menu[this.state.submenuEdit];
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

                var panel =
                        <PanelAddItems
                            itemInfo={item_info}
                            availableItems={available_items}
                            onAddItem={this.addSubmenuItem}
                        />
                    ;
                var secondary_actions =
                        <SecondaryActions
                            title={l10n.panel_actions_title_submenu_add}
                            previousPanel="submenu"
                            onLoadPanel={this.loadPanel}
                        />
                    ;
                break;
            }
            case 'dashboard':
            {

                let current_items = customizations.dashboard;
                let available_items = getAvailableItems(current_items);

                var panel =
                        <PanelDashboard
                            widgets={available_items}
                            onWidgetEdit={this.widgetEdit}
                            onDeleteWidget={this.widgetDelete}
                            onLoadPanel={this.loadPanel}
                        />
                    ;
                var secondary_actions =
                        <SecondaryActions
                            title={l10n.panel_actions_title_dashboard}
                            previousPanel="primary"
                            nextPanel="addWidgets"
                            loadNextText={l10n.action_button_add_items}
                            onLoadPanel={this.loadPanel}
                        />
                    ;
                break;
            }
            case 'addWidgets':
            {

                let current_items = customizations.dashboard;
                let available_items = getDeletedItems(current_items);

                available_items = setToOriginalTitles(available_items);

                var panel =
                        <PanelAddItems
                            availableItems={available_items}
                            onAddItem={this.widgetAdd}
                        />
                    ;
                var secondary_actions =
                        <SecondaryActions
                            title={l10n.panel_actions_title_menu_add}
                            previousPanel="dashboard"
                            onLoadPanel={this.loadPanel}
                        />
                    ;
                break;
            }

            case 'loading':
            {

                var panel =
                        <PanelLoading />
                    ;
                var secondary_actions =
                        <SecondaryActions />
                    ;
                break;
            }
        }

        return (
            <div id="cd-editor">

                <div className="cd-editor-header">
                    <PrimaryActions
                        onSaveChanges={this.saveChanges}
                        onPreviewChanges={this.previewChanges}
                        onHideCustomizer={this.hideCustomizer}
                        onCloseCustomizer={this.closeCustomizer}
                    />

                    <RoleSwitcher
                        role={this.props.role}
                        onSwitchRole={this.switchRole}
                    />
                </div>

                <div className="cd-editor-panels">
                    {panel}
                </div>

                <div className="cd-editor-footer">
                    {secondary_actions}
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
        }

        this.hideCustomizer = this.hideCustomizer.bind(this);
        this.showCustomizer = this.showCustomizer.bind(this);
        this.switchRole = this.switchRole.bind(this);
        this.loadData = this.loadData.bind(this);
        this.refreshPreview = this.refreshPreview.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {

        // Don't reload if setting saveRole to false
        if (this.state.saveRole === true && nextState.saveRole === false) {

            return false;
        }

        return true;
    }

    //componentDidUpdate(prevProps, prevState) {
    //
    //    if (this.state.saveRole === true) {
    //
    //        this.setState({
    //            saveRole: false,
    //        });
    //    }
    //}

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

        this.refs.editor.loadRole();

        if (this.state.saveRole === true) {

            this.setState({
                saveRole: false,
            });
        }
    }

    refreshPreview() {

        this.refs.preview.refresh();
    }

    render() {

        return (
            <div className={"cd-customize-container " + (this.state.hidden ? "hidden" : "")}>
                {this.state.hidden &&
                <button type="button" className="cd-customize-show" aria-label={l10n.show_controls}
                        title={l10n.show_controls} onClick={this.showCustomizer}>
                    <span className="cd-customize-show-icon fa fa-chevron-circle-right"/>
                </button>
                }

                <Editor
                    onHideCustomizer={this.hideCustomizer}
                    onSwitchRole={this.switchRole}
                    refreshPreview={this.refreshPreview}
                    role={this.state.role}
                    ref="editor"
                />

                <Preview
                    role={this.state.role}
                    onLoad={this.loadData}
                    saveRole={this.state.saveRole}
                    ref="preview"
                />
            </div>
        )
    }
}

// Renders the Customizer
ReactDOM.render(
    <Customize />,
    document.getElementById('clientdash-customize')
);