import React from 'react';
import ReactDOM from 'react-dom';

const dashicons = ClientdashCustomize_Data.dashicons;
const adminurl = ClientdashCustomize_Data.adminurl;
const roles = ClientdashCustomize_Data.roles;
const l10n = ClientdashCustomize_Data.l10n;

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

        this.props.options.forEach((option) =>
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
                        <span className={"cd-editor-lineitem-icon " + this.props.icon}></span>
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
            title: this.props.title,
            icon: this.props.icon
        }

        this.toggleEdit = this.toggleEdit.bind(this);
        this.titleChange = this.titleChange.bind(this);
        this.iconChange = this.iconChange.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    toggleEdit() {

        this.setState((prevState) => ({
            editing: !prevState.editing
        }));
    }

    titleChange(value) {

        this.setState({
            title: value
        });
    }

    iconChange(value) {

        this.setState({
            icon: "dashicons " + value
        });
    }

    deleteItem() {

        this.props.onDeleteItem(this.props.id);
    }

    render() {

        const actions = [
            <LineItemAction
                key="menu-action-submenu"
                icon="th-list"
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
            <LineItem
                key={this.props.id}
                title={this.state.title || this.props.originalTitle}
                icon={this.state.icon}
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
class MenuItemAdd extends React.Component {

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
    }

    hideCustomizer() {

        this.props.onHideCustomizer();
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
                    onHandleClick=""
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
                <Select options={roles} label={l10n.role_switcher_label} selected=""/>
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

        this.deleteItem = this.deleteItem.bind(this);
    }

    deleteItem(item_id) {

        this.props.onDeleteItem(item_id);
    }

    render() {

        var menu_items = [];

        this.props.menuItems.map((item) => {

            menu_items.push(
                <MenuItemEdit
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    originalTitle={item.original_title}
                    icon={item.icon}
                    onDeleteItem={this.deleteItem}
                />
            );
        });

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
 * The add menu items panel.
 *
 * @since {{VERSION}}
 */
class PanelMenuAddItems extends React.Component {

    constructor(props) {

        super(props);

        this.addItem = this.addItem.bind(this);
    }

    addItem(menu_item) {

        this.props.onAddItem(menu_item);
    }

    render() {

        var menu_items = [];

        // TODO real data
        const temp_data = [
            {
                id: 'comments',
                title: 'Comments',
                icon: 'dashicons dashicons-admin-comments',
            },
            {
                id: 'settings',
                title: 'Settings',
                icon: 'dashicons dashicons-admin-settings',
            },
        ];

        temp_data.map((item) => {

            menu_items.push(
                <MenuItemAdd
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    icon={item.icon}
                    onAddItem={this.addItem}
                />
            );
        });

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
 * Panel specific actions for Menu.
 *
 * @since {{VERSION}}
 */
class SecondaryActions extends React.Component {

    constructor(props) {

        super(props);

        this.loadPanel = this.loadPanel.bind(this);
        this.previousPanel = this.previousPanel.bind(this);
    }

    loadPanel() {

        this.props.onLoadPanel(this.props.nextPanel);
    }

    previousPanel() {

        this.props.onPreviousPanel();
    }

    render() {
        return (
            <footer className="cd-editor-footer">
                <div className="cd-editor-panel-actions-title">
                    {this.props.title}
                </div>

                <div className="cd-editor-panel-actions-buttons">
                    <ActionButton
                        text={l10n.action_button_back}
                        icon="chevron-left"
                        align="left"
                        onHandleClick={this.previousPanel}
                    />

                    {this.props.nextPanel &&
                    <ActionButton
                        text={l10n.action_button_add_items}
                        icon="plus"
                        align="right"
                        onHandleClick={this.loadPanel}
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
                <iframe src={adminurl}/>
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

        // TODO real data
        const temp_data = [
            {
                id: 'dashboard',
                title: '',
                original_title: 'Dashboard',
                icon: 'dashicons dashicons-dashboard',
            },
            {
                id: 'posts',
                title: '',
                original_title: 'Posts',
                icon: 'dashicons dashicons-admin-post',
            },
            {
                id: 'media',
                title: '',
                original_title: 'Media',
                icon: 'dashicons dashicons-admin-media',
            }
        ];


        this.state = {
            previousPanel: null,
            nextPanel: null,
            activePanel: 'primary', // TODO set to "primary"
            hidden: false,
            menuItems: temp_data
        }

        this.loadPanel = this.loadPanel.bind(this);
        this.previousPanel = this.previousPanel.bind(this);
        this.hideCustomizer = this.hideCustomizer.bind(this);
        this.addMenuItem = this.addMenuItem.bind(this);
        this.deleteMenuItem = this.deleteMenuItem.bind(this);
    }

    loadPanel(panel_ID) {

        this.setState({
            previousPanel: this.state.activePanel,
            activePanel: panel_ID
        });
    }

    previousPanel() {

        this.loadPanel(this.state.previousPanel);
    }

    loadNextPanel() {

        this.loadPanel(this.state.nextPanel);
    }

    hideCustomizer() {

        this.props.onHideCustomizer();
    }

    addMenuItem(menu_item) {

        this.setState((prevState) => {

            prevState.menuItems.push(menu_item);

            return prevState;
        });

        this.loadPanel('menu');
    }

    deleteMenuItem(item_id) {

        this.setState((prevState) => ({
            menuItems: prevState.menuItems.filter((menu_item) => {

                return menu_item.id !== item_id;
            })
        }));
    }

    render() {

        var panel, secondary_actions;

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
                        onDeleteItem={this.deleteMenuItem}
                        onLoadPanel={this.loadPanel}
                    />
                ;
                secondary_actions =
                    <SecondaryActions
                        title={l10n.panel_actions_title_menu}
                        nextPanel="addMenuItems"
                        onLoadPanel={this.loadPanel}
                        onPreviousPanel={this.previousPanel}
                    />
                ;
                break;

            case 'addMenuItems':

                panel =
                    <PanelMenuAddItems
                        onAddItem={this.addMenuItem}
                    />
                ;
                secondary_actions =
                    <SecondaryActions
                        title={l10n.panel_actions_title_menu_add}
                        onPreviousPanel={this.previousPanel}
                    />
                ;
                break;
        }

        return (
            <div id="cd-editor">

                <PrimaryActions
                    onHideCustomizer={this.hideCustomizer}
                />

                <RoleSwitcher />

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
                <button type="button" className="cd-customize-show" aria-label={l10n.show_controls}
                        title={l10n.show_controls} onClick={this.showCustomizer}>
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