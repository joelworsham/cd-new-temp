import React from 'react';
import ReactDOM from 'react-dom';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

const data = ClientdashCustomize_Data || false;

const SortableItem = SortableElement(({value}) => <li>{value}</li>);

const SortableList = SortableContainer(({items}) => {
    return (
        <ul>
            {items.map((value, index) =>
                <SortableItem key={`item-${index}`} index={index} value={value}/>
            )}
        </ul>
    );
});

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

        data.dashicons.map((dashicon) => {
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
                    {data.l10n.icon}
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

                {this.props.text}
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

    handleClick() {

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
class LineItem extends React.Component {
    render() {
        return (
            <li id={this.props.id} className="cd-editor-lineitem">
                <div className="cd-editor-lineitem-block">
                    <div className="cd-editor-lineitem-title">
                        {this.props.icon &&
                        <span className={"cd-editor-lineitem-icon " + this.props.icon}></span>
                        }
                        {this.props.title}
                    </div>

                    <div className="cd-editor-lineitem-actions">
                        {this.props.actions}
                    </div>
                </div>

                {this.props.form && this.props.form}
            </li>
        )
    }
}

/**
 * Line items list.
 *
 * @since {{VERSION}}
 */
class LineItems extends React.Component {
    render() {
        return (
            <ul className="cd-editor-lineitems">
                {this.props.children}
            </ul>
        )
    }
}

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
            icon: "dashicons " + value,
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

        const actions = [
            <LineItemAction
                key="menu-action-submenu"
                icon="th-list"
                onHandleClick={this.submenuEdit}
            />,
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
                    {data.l10n.original_title + " "}<strong>{this.props.originalTitle}</strong>
                </span>
            ;

        const form =
                <LineItemForm>
                    <InputText
                        label={data.l10n.title}
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
            <LineItem
                key={this.props.id}
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
    }

    toggleEdit() {

        this.setState((prevState) => ({
            editing: !prevState.editing
        }));
    }

    titleChange(value) {

        this.props.onSubmenuItemEdit(this.props.id, {
            title: value,
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
                    {data.l10n.original_title + " "}<strong>{this.props.originalTitle}</strong>
                </span>
            ;

        const form =
                <LineItemForm>
                    <InputText
                        label={data.l10n.title}
                        value={this.props.title}
                        placeholder={this.props.originalTitle}
                        onHandleChange={this.titleChange}
                        after={after_title}
                    />
                </LineItemForm>
            ;


        return (
            <LineItem
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
            <LineItem
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
        this.hideCustomizer = this.hideCustomizer.bind(this);
        this.closeCustomizer = this.closeCustomizer.bind(this);
    }

    saveChanges() {

        this.props.onSaveChanges();
    }

    hideCustomizer() {

        this.props.onHideCustomizer();
    }

    closeCustomizer() {

        this.props.onCloseCustomizer();
    }

    render() {
        return (
            <header className="cd-editor-header">
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
                    text="Save"
                    icon="check"
                    onHandleClick={this.saveChanges}
                />
            </header>
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
                    options={data.roles}
                    label={data.l10n.role_switcher_label}
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
                    text={data.l10n.panel_text_menu}
                    target="menu"
                    onLoadPanel={this.onLoadPanel}
                />
                <PanelLoadButton
                    text={data.l10n.panel_text_dashboard}
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

        this.deleteItem = this.deleteItem.bind(this);
        this.menuItemEdit = this.menuItemEdit.bind(this);
        this.submenuEdit = this.submenuEdit.bind(this);
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

        if (Object.keys(this.props.menuItems).length) {

            Object.keys(this.props.menuItems).forEach((ID) => {

                let item = this.props.menuItems[ID];
                let menu_item =
                        <MenuItemEdit
                            key={ID}
                            id={ID}
                            title={item.title}
                            originalTitle={item.original_title}
                            icon={item.icon}
                            onMenuItemEdit={this.menuItemEdit}
                            onSubmenuEdit={this.submenuEdit}
                            onDeleteItem={this.deleteItem}
                        />
                    ;

                //menu_item = sortable(menu_item);

                menu_items.push(menu_item);
            });

        } else {

            menu_items =
                <div className="cd-editor-panel-helptext">
                    {data.l10n.no_items_added}
                </div>
            ;
        }

        return (
            <Panel>
                <LineItems>
                    {menu_items}
                </LineItems>
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

        this.deleteItem = this.deleteItem.bind(this);
        this.submenuItemEdit = this.submenuItemEdit.bind(this);
    }

    deleteItem(item_id) {

        this.props.onDeleteItem(item_id);
    }

    submenuItemEdit(ID, item) {

        this.props.onSubmenuItemEdit(ID, item);
    }

    render() {

        var menu_items = [];

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

        } else {

            menu_items =
                <div className="cd-editor-panel-helptext">
                    {data.l10n.no_items_added}
                </div>
            ;
        }

        return (
            <Panel>
                {this.props.itemInfo}

                <LineItems>
                    {menu_items}
                </LineItems>
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

        //var available_items = data.orig_menu.filter(item => );
        var menu_items = [];

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

        } else {

            menu_items =
                <div className="cd-editor-panel-helptext">
                    {data.l10n.no_items_available}
                </div>
            ;
        }

        return (
            <Panel>
                {this.props.itemInfo}

                <LineItems>
                    {menu_items}
                </LineItems>
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

        } else {

            widgets =
                <div className="cd-editor-panel-helptext">
                    {data.l10n.no_items_added}
                </div>
            ;
        }

        return (
            <Panel>
                <LineItems
                    sortable={true}
                >
                    {widgets}
                </LineItems>
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
                    {data.l10n.original_title + " "}<strong>{this.props.originalTitle}</strong>
                </span>
            ;

        const form =
                <LineItemForm>
                    <InputText
                        label={data.l10n.title}
                        value={this.props.title}
                        placeholder={this.props.originalTitle}
                        onHandleChange={this.titleChange}
                        after={after_title}
                    />
                </LineItemForm>
            ;

        return (
            <LineItem
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
            <footer className="cd-editor-footer">
                {this.props.title &&
                <div className="cd-editor-panel-actions-title">
                    {this.props.title}
                </div>
                }

                <div className="cd-editor-panel-actions-buttons">
                    {this.props.previousPanel &&
                    <ActionButton
                        text={data.l10n.action_button_back}
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
            </footer>
        )
    }
}

/**
 * The Customize preview.
 *
 * @since {{VERSION}}
 */
class Preview extends React.Component {
    render() {
        return (
            <section id="cd-preview">
                <iframe src={data.adminurl}/>
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
            activePanel: 'menu', // TODO set to "primary"
            hidden: false,
            role: 'administrator',
            menuItems: data.menu,
            submenuItems: data.submenu,
            submenuEdit: null,
            widgets: data.widgets,
            data: {},
        }

        this.loadPanel = this.loadPanel.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.hideCustomizer = this.hideCustomizer.bind(this);
        this.closeCustomizer = this.closeCustomizer.bind(this);
        this.switchRole = this.switchRole.bind(this);
        this.menuItemAdd = this.menuItemAdd.bind(this);
        this.addSubmenuItem = this.addSubmenuItem.bind(this);
        this.menuItemDelete = this.menuItemDelete.bind(this);
        this.deleteSubmenuItem = this.deleteSubmenuItem.bind(this);
        this.submenuEdit = this.submenuEdit.bind(this);
        this.menuItemEdit = this.menuItemEdit.bind(this);
        this.submenuItemEdit = this.submenuItemEdit.bind(this);
        this.widgetAdd = this.widgetAdd.bind(this);
        this.widgetDelete = this.widgetDelete.bind(this);
        this.widgetEdit = this.widgetEdit.bind(this);
    }

    componentDidUpdate() {

        this.updateData();
    }

    updateData() {

        this.state.data[this.state.role] = {
            menu: this.state.menuItems,
            submenu: this.state.submenuItems,
            widgets: this.state.widgets,
        };
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

        window.location.href = data.adminurl;
    }

    saveChanges() {

        console.log('saving...');

        fetch('wp-json/clientdash/v1/customizations/' + this.state.role, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                menu: this.state.menuItems,
                submenu: this.state.submenuItems,
                widgets: this.state.widgets
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

    switchRole(role) {

        var menuItems, submenuItems, widgets, api = this;

        if (this.state.data[role]) {

            menuItems = this.state.data[role].menu;
            submenuItems = this.state.data[role].submenu;
            widgets = this.state.data[role].widgets;

            this.setState({
                role: role,
                menuItems: menuItems,
                submenuItems: submenuItems,
                widgets: widgets,
            });

        } else {

            fetch('wp-json/clientdash/v1/customizations/' + role, {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }).then(function (response) {

                return response.json();

            }).then(function (customizations) {

                console.log('status: ', customizations);

                menuItems = [];
                submenuItems = [];
                widgets = [];

                api.setState({
                    role: role,
                    menuItems: menuItems,
                    submenuItems: submenuItems,
                    widgets: widgets,
                });

            }).catch(function (error) {

                console.log('error: ', error);

            });
        }
    }

    menuItemAdd(ID, item) {

        this.setState((prevState) => {

            prevState.menuItems[ID] = item;

            return prevState;
        });

        this.loadPanel('menu');
    }

    addSubmenuItem(ID, item) {

        let submenu_edit = this.state.submenuEdit;

        this.setState((prevState) => {

            prevState.submenuItems[submenu_edit][ID] = item;

            return prevState;
        });

        this.loadPanel('submenu');
    }

    menuItemDelete(ID) {

        this.setState((prevState) => {

            delete prevState.menuItems[ID];

            return prevState;
        });
    }

    deleteSubmenuItem(ID) {

        let submenu_edit = this.state.submenuEdit;

        this.setState((prevState) => {

            delete prevState.submenuItems[submenu_edit][ID];

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

        this.setState((prevState) => {

            prevState.menuItems[ID] = item;

            return prevState;
        });
    }

    submenuItemEdit(ID, item) {

        let submenu_edit = this.state.submenuEdit;

        this.setState((prevState) => {

            prevState.submenuItems[submenu_edit][ID] = (_item) => (item);

            return prevState;
        });
    }

    widgetAdd(ID, widget) {

        this.setState((prevState) => {

            prevState.widgets[ID] = widget;

            return prevState;
        });

        this.loadPanel('dashboard');
    }

    widgetDelete(ID) {

        this.setState((prevState) => {

            delete prevState.widgets[ID];

            return prevState;
        });
    }

    widgetEdit(ID, widget) {

        this.setState((prevState) => {

            prevState.widgets[ID] = (widget);

            return prevState;
        });
    }

    render() {

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

                var panel =
                        <PanelMenu
                            menuItems={this.state.menuItems}
                            onMenuItemEdit={this.menuItemEdit}
                            onDeleteItem={this.menuItemDelete}
                            onLoadPanel={this.loadPanel}
                            onSubmenuEdit={this.submenuEdit}
                        />
                    ;
                var secondary_actions =
                        <SecondaryActions
                            title={data.l10n.panel_actions_title_menu}
                            previousPanel="primary"
                            nextPanel="addMenuItems"
                            loadNextText={data.l10n.action_button_add_items}
                            onLoadPanel={this.loadPanel}
                        />
                    ;
                break;
            }
            case 'submenu':
            {

                let menu_item = this.state.menuItems[this.state.submenuEdit];
                let item_info =
                        <div className="cd-editor-panel-menuinfo">
                            <span className={"cd-editor-panel-menuinfo-icon " + menu_item.icon}></span>
                                <span className="cd-editor-panel-menuinfo-title">
                                    {menu_item.title || menu_item.original_title}
                                </span>
                        </div>
                    ;

                var panel =
                        <PanelSubmenu
                            itemInfo={item_info}
                            onSubmenuItemEdit={this.submenuItemEdit}
                            submenuItems={this.state.submenuItems[this.state.submenuEdit] || []}
                            onDeleteItem={this.deleteSubmenuItem}
                            onLoadPanel={this.loadPanel}
                        />
                    ;
                var secondary_actions =
                        <SecondaryActions
                            title={data.l10n.panel_actions_title_submenu}
                            nextPanel="addSubmenuItems"
                            previousPanel="menu"
                            loadNextText={data.l10n.action_button_add_items}
                            onLoadPanel={this.loadPanel}
                        />
                    ;
                break;
            }
            case 'addMenuItems':
            {

                let available_items = {};
                let current_items = this.state.menuItems;

                if (Object.keys(data.orig_menu).length) {

                    // Array diff to get all items that don't yet exist in the menu
                    Object.keys(data.orig_menu).forEach((ID) => {

                        let item = data.orig_menu[ID];

                        if (!current_items[ID]) {

                            available_items[ID] = item;
                        }
                    });
                }

                var panel =
                        <PanelAddItems
                            availableItems={available_items}
                            onAddItem={this.menuItemAdd}
                        />
                    ;
                var secondary_actions =
                        <SecondaryActions
                            title={data.l10n.panel_actions_title_menu_add}
                            previousPanel="menu"
                            onLoadPanel={this.loadPanel}
                        />
                    ;
                break;
            }
            case 'addSubmenuItems':
            {
                let menu_item = this.state.menuItems[this.state.submenuEdit];
                let item_info =
                        <div className="cd-editor-panel-menuinfo">
                            <span className={"cd-editor-panel-menuinfo-icon " + menu_item.icon}></span>
                                <span className="cd-editor-panel-menuinfo-title">
                                    {menu_item.title || menu_item.original_title}
                                </span>
                        </div>
                    ;

                let available_items = {};
                let current_items = this.state.submenuItems[this.state.submenuEdit];

                if (Object.keys(data.orig_submenu[this.state.submenuEdit]).length) {

                    // Array diff to get all items that don't yet exist in the menu
                    Object.keys(data.orig_submenu[this.state.submenuEdit]).forEach((ID) => {

                        let item = data.orig_submenu[this.state.submenuEdit][ID];

                        if (!current_items[ID]) {

                            available_items[ID] = item;
                        }
                    });
                }

                var panel =
                        <PanelAddItems
                            itemInfo={item_info}
                            availableItems={available_items}
                            onAddItem={this.addSubmenuItem}
                        />
                    ;
                var secondary_actions =
                        <SecondaryActions
                            title={data.l10n.panel_actions_title_submenu_add}
                            previousPanel="submenu"
                            onLoadPanel={this.loadPanel}
                        />
                    ;
                break;
            }
            case 'dashboard':
            {

                var panel =
                        <PanelDashboard
                            widgets={this.state.widgets}
                            onWidgetEdit={this.widgetEdit}
                            onDeleteWidget={this.widgetDelete}
                            onLoadPanel={this.loadPanel}
                        />
                    ;
                var secondary_actions =
                        <SecondaryActions
                            title={data.l10n.panel_actions_title_dashboard}
                            previousPanel="primary"
                            nextPanel="addWidgets"
                            loadNextText={data.l10n.action_button_add_items}
                            onLoadPanel={this.loadPanel}
                        />
                    ;
                break;
            }
            case 'addWidgets':
            {

                let available_items = {};
                let current_items = this.state.widgets;

                if (Object.keys(data.orig_widgets).length) {

                    // Array diff to get all items that don't yet exist in the menu
                    Object.keys(data.orig_widgets).forEach((ID) => {

                        let item = data.orig_widgets[ID];

                        if (!current_items[ID]) {

                            available_items[ID] = item;
                        }
                    });
                }

                var panel =
                        <PanelAddItems
                            availableItems={available_items}
                            onAddItem={this.widgetAdd}
                        />
                    ;
                var secondary_actions =
                        <SecondaryActions
                            title={data.l10n.panel_actions_title_menu_add}
                            previousPanel="dashboard"
                            onLoadPanel={this.loadPanel}
                        />
                    ;
                break;
            }
        }

        return (
            <div id="cd-editor">

                <PrimaryActions
                    onSaveChanges={this.saveChanges}
                    onHideCustomizer={this.hideCustomizer}
                    onCloseCustomizer={this.closeCustomizer}
                />

                <RoleSwitcher
                    role={this.state.role}
                    onSwitchRole={this.switchRole}
                />

                <div className="cd-editor-panels">
                    {panel}
                </div>

                {secondary_actions}

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
            hidden: false
        }

        this.hideCustomizer = this.hideCustomizer.bind(this);
        this.showCustomizer = this.showCustomizer.bind(this);
    }

    hideCustomizer() {

        this.setState({
            hidden: true
        });
    }

    showCustomizer() {

        this.setState({
            hidden: false
        });
    }

    render() {
        return (
            <div className={"cd-customize-container " + (this.state.hidden ? "hidden" : "")}>
                {this.state.hidden &&
                <button type="button" className="cd-customize-show" aria-label={data.l10n.show_controls}
                        title={data.l10n.show_controls} onClick={this.showCustomizer}>
                    <span className="cd-customize-show-icon fa fa-chevron-circle-right"/>
                </button>
                }

                <Editor
                    onHideCustomizer={this.hideCustomizer}
                />
                <Preview />
            </div>
        )
    }
}

// Renders the Customizer
ReactDOM.render(
    <Customize />,
    document.getElementById('clientdash-customize')
);