import React from 'react';
import ReactDOM from 'react-dom';

const data = ClientdashCustomize_Data || false;

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

        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {

        this.setState({
            value: event.target.value
        });

        this.props.onHandleChange();
    }

    render() {

        var rows = [];
        const selected = this.props.selected;

        this.props.options.map((option) =>
            rows.push(
                <SelectOption key={option.value} defaultValue={option.value} text={option.text}/>
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
                        {rows}
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

        this.props.onMenuItemEdit({
            id: this.props.id,
            title: value,
            icon: this.props.icon,
        });
    }

    iconChange(value) {

        this.props.onMenuItemEdit({
            id: this.props.id,
            icon: "dashicons " + value,
            title: this.props.title,
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

        this.props.onSubmenuItemEdit({
            id: this.props.id,
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

        this.hideCustomizer = this.hideCustomizer.bind(this);
        this.closeCustomizer = this.closeCustomizer.bind(this);
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
                    onHandleClick=""
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
    render() {

        return (
            <div className="cd-editor-role-switcher">
                <Select options={data.roles} label={data.l10n.role_switcher_label} selected=""/>
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

    deleteItem(item_id) {

        this.props.onDeleteItem(item_id);
    }

    menuItemEdit(item) {

        this.props.onMenuItemEdit(item);
    }

    submenuEdit(item_id) {

        this.props.onSubmenuEdit(item_id);
    }

    render() {

        var menu_items = [];

        if (this.props.menuItems.length) {

            this.props.menuItems.map((item) => {

                menu_items.push(
                    <MenuItemEdit
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        originalTitle={item.original_title}
                        icon={item.icon}
                        onMenuItemEdit={this.menuItemEdit}
                        onSubmenuEdit={this.submenuEdit}
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

    submenuItemEdit(item) {

        this.props.onSubmenuItemEdit(item);
    }

    render() {

        var menu_items = [];

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

    addItem(menu_item) {

        this.props.onAddItem(menu_item);
    }

    render() {

        //var available_items = data.orig_menu.filter(item => );
        var menu_items = [];

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

    widgetDelete(widget_id) {

        this.props.onDeleteWidget(widget_id);
    }

    widgetEdit(widget) {

        this.props.onWidgetEdit(widget);
    }

    render() {

        var widgets = [];

        if (this.props.widgets.length) {

            this.props.widgets.map((item) => {

                widgets.push(
                    <WidgetEdit
                        key={item.id}
                        id={item.id}
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
                <LineItems>
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

        this.props.onWidgetEdit({
            id: this.props.id,
            title: value,
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
            activePanel: 'dashboard', // TODO set to "primary"
            hidden: false,
            role: 'administrator',
            menuItems: data.menu,
            submenuItems: data.submenu,
            submenuEdit: null,
            widgets: data.widgets,
        }

        this.loadPanel = this.loadPanel.bind(this);
        this.hideCustomizer = this.hideCustomizer.bind(this);
        this.closeCustomizer = this.closeCustomizer.bind(this);
        this.switchRole = this.switchRole.bind(this);
        this.addMenuItem = this.addMenuItem.bind(this);
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

    switchRole(role) {

        this.setState({
            role: role
        });
    }

    addMenuItem(menu_item) {

        this.setState((prevState) => {

            prevState.menuItems.push(menu_item);

            return prevState;
        });

        this.loadPanel('menu');
    }

    addSubmenuItem(menu_item) {

        this.setState((prevState) => {

            if (prevState.submenuItems[this.state.submenuEdit]) {

                prevState.submenuItems[this.state.submenuEdit].push(menu_item);

            } else {

                prevState.submenuItems[this.state.submenuEdit] = [menu_item];
            }

            return prevState;
        });

        this.loadPanel('submenu');
    }

    menuItemDelete(item_id) {

        this.setState((prevState) => ({
            menuItems: prevState.menuItems.filter((menu_item) => {

                return menu_item.id !== item_id;
            })
        }));
    }

    deleteSubmenuItem(item_id) {

        const state = this.state;

        this.setState((prevState) => {

            prevState.submenuItems[state.submenuEdit] = prevState.submenuItems[state.submenuEdit].filter((submenu_item) => {
                return submenu_item.id !== item_id
            });

            return prevState;
        });
    }

    submenuEdit(item_id) {

        this.setState({
            submenuEdit: item_id
        });

        this.loadPanel('submenu');
    }

    menuItemEdit(item) {

        this.setState((prevState) => ({
            menuItems: prevState.menuItems.map((menu_item) => {

                if (menu_item.id == item.id) {

                    menu_item.title = item.title;
                    menu_item.icon = item.icon;
                }

                return menu_item;
            }),
        }));
    }

    submenuItemEdit(item) {

        const state = this.state;

        this.setState((prevState) => {

            prevState.submenuItems[state.submenuEdit] = prevState.submenuItems[state.submenuEdit].map((submenu_item) => {

                if (submenu_item.id == item.id) {

                    submenu_item.title = item.title;
                }

                return submenu_item;
            });

            return prevState;
        });
    }

    widgetAdd(widget) {

        this.setState((prevState) => {

            prevState.widgets.push(widget);

            return prevState;
        });

        this.loadPanel('dashboard');
    }

    widgetDelete(widget_id) {

        this.setState((prevState) => ({
            widgets: prevState.widgets.filter((widget) => {

                return widget.id !== widget_id;
            })
        }));
    }

    widgetEdit(new_widget) {

        this.setState((prevState) => ({
            widgets: prevState.widgets.map((widget) => {

                if (widget.id == new_widget.id) {

                    widget.title = new_widget.title;
                }

                return widget;
            }),
        }));
    }

    render() {

        var panel, secondary_actions, available_items, available_widgets, item_info;
        var state = this.state;

        // Get current menu info
        if (this.state.activePanel == 'submenu' || this.state.activePanel == 'addSubmenuItems') {

            this.state.menuItems.map((item) => {

                if (item.id == state.submenuEdit) {

                    item_info =
                        <div className="cd-editor-panel-menuinfo">
                            <span className={"cd-editor-panel-menuinfo-icon " + item.icon}></span>
                                <span className="cd-editor-panel-menuinfo-title">
                                    {item.title || item.original_title}
                                </span>
                        </div>
                    ;

                    return false;
                }
            });
        }

        switch (this.state.activePanel) {

            case 'primary':

                panel =
                    <PanelPrimary
                        onLoadPanel={this.loadPanel}
                    />
                ;
                secondary_actions =
                    <SecondaryActions />
                ;
                break;

            case 'menu':

                panel =
                    <PanelMenu
                        menuItems={this.state.menuItems}
                        onMenuItemEdit={this.menuItemEdit}
                        onDeleteItem={this.menuItemDelete}
                        onLoadPanel={this.loadPanel}
                        onSubmenuEdit={this.submenuEdit}
                    />
                ;
                secondary_actions =
                    <SecondaryActions
                        title={data.l10n.panel_actions_title_menu}
                        previousPanel="primary"
                        nextPanel="addMenuItems"
                        loadNextText={data.l10n.action_button_add_items}
                        onLoadPanel={this.loadPanel}
                    />
                ;
                break;

            case 'submenu':

                panel =
                    <PanelSubmenu
                        itemInfo={item_info}
                        onSubmenuItemEdit={this.submenuItemEdit}
                        submenuItems={this.state.submenuItems[this.state.submenuEdit] || []}
                        onDeleteItem={this.deleteSubmenuItem}
                        onLoadPanel={this.loadPanel}
                    />
                ;
                secondary_actions =
                    <SecondaryActions
                        title={data.l10n.panel_actions_title_submenu}
                        nextPanel="addSubmenuItems"
                        previousPanel="menu"
                        loadNextText={data.l10n.action_button_add_items}
                        onLoadPanel={this.loadPanel}
                    />
                ;
                break;

            case 'addMenuItems':

                if (data.orig_menu) {

                    // Array diff to get all items that don't yet exist in the menu
                    available_items = data.orig_menu.filter((item) => {
                        return state.menuItems.filter(_item => _item.id === item.id).length === 0;
                    });

                } else {

                    available_items = [];
                }

                panel =
                    <PanelAddItems
                        availableItems={available_items}
                        onAddItem={this.addMenuItem}
                    />
                ;
                secondary_actions =
                    <SecondaryActions
                        title={data.l10n.panel_actions_title_menu_add}
                        previousPanel="menu"
                        onLoadPanel={this.loadPanel}
                    />
                ;
                break;

            case 'addSubmenuItems':

                if (data.orig_submenu[this.state.submenuEdit]) {

                    // Array diff to get all items that don't yet exist in the menu
                    available_items = data.orig_submenu[this.state.submenuEdit].filter((item) => {
                        return state.submenuItems[state.submenuEdit].filter(_item => _item.id === item.id).length === 0;
                    });

                } else {

                    available_items = [];
                }

                panel =
                    <PanelAddItems
                        itemInfo={item_info}
                        availableItems={available_items}
                        onAddItem={this.addSubmenuItem}
                    />
                ;
                secondary_actions =
                    <SecondaryActions
                        title={data.l10n.panel_actions_title_submenu_add}
                        previousPanel="submenu"
                        onLoadPanel={this.loadPanel}
                    />
                ;
                break;

            case 'dashboard':

                panel =
                    <PanelDashboard
                        widgets={this.state.widgets}
                        onWidgetEdit={this.widgetEdit}
                        onDeleteWidget={this.widgetDelete}
                        onLoadPanel={this.loadPanel}
                    />
                ;
                secondary_actions =
                    <SecondaryActions
                        title={data.l10n.panel_actions_title_dashboard}
                        previousPanel="primary"
                        nextPanel="addWidgets"
                        loadNextText={data.l10n.action_button_add_items}
                        onLoadPanel={this.loadPanel}
                    />
                ;
                break;

            case 'addWidgets':

                if (data.orig_widgets) {

                    // Array diff to get all items that don't yet exist in the menu
                    available_widgets = data.orig_widgets.filter((widget) => {
                        return state.widgets.filter(_widget => _widget.id === widget.id).length === 0;
                    });

                } else {

                    available_widgets = [];
                }

                panel =
                    <PanelAddItems
                        availableItems={available_widgets}
                        onAddItem={this.widgetAdd}
                    />
                ;
                secondary_actions =
                    <SecondaryActions
                        title={data.l10n.panel_actions_title_menu_add}
                        previousPanel="dashboard"
                        onLoadPanel={this.loadPanel}
                    />
                ;
                break;
        }

        return (
            <div id="cd-editor">

                <PrimaryActions
                    onHideCustomizer={this.hideCustomizer}
                    onCloseCustomizer={this.closeCustomizer}
                />

                <RoleSwitcher
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