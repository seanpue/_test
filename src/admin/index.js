import CMS from "netlify-cms"
import React from "react"

var CategoriesControl = createClass({
  
    handleChange: function(e) {
      const separator = this.props.field.get('separator', ', ')
      this.props.onChange(e.target.value.split(separator).map((e) => e.trim()));
    },

  render: function() {
    const separator = this.props.field.get('separator', ', ');
    var value = this.props.value;
    return h('input', {
      id: this.props.forID,
      className: this.props.classNameWrapper,
      type: 'text',
      value: value ? value.join(separator) : '',
      onChange: this.handleChange,
    });
  },
});

var CategoriesPreview = createClass({
  render: function() {
    return h('ul', {},
      this.props.value.map(function(val, index) {
        return h('li', {key: index}, val);
      })
    );
  }
});

var schema = {
  properties: {
    separator: { type: 'string' },
  },
}

CMS.registerWidget('categories', CategoriesControl, CategoriesPreview, schema);

var TablePreview = createClass({
  render: function () {
    return h('ul', {},
      this.props.value.map(function(val, index) {
        return h('li', {key: index}, val);
      })
    );
  }
})

var TableControl = createClass({
  handleChange() {

  },
  getInitialState: function() {
    return {
      message: "",
      items: this.props.value || []
    }
  },
  //onChange: Callback function to update the field value
  updateMessage(event) {
    this.setState({
      message: event.target.value
    });
    
  },

  handleClick() {
    var items = this.state.items;

    items.push(this.state.message);

    this.setState({
      items: items,
      message: ""
    });
    this.props.onChange(items); // update Netlify
  },

  handleItemChanged(i, event) {
    var items = this.state.items;
    items[i]  = event.target.value;

    this.setState({
      items: items
    });
    
    this.props.onChange(items); // update Netlify

  },

  handleItemDeleted(i) {
    var items = this.state.items;

    items.splice(i, 1);

    this.setState({
      items: items
    });
    this.props.onChange(items); // update Netlify
  },

  renderRows() {
    var context = this;

    return  this.state.items.map(function(o, i) {
      /*return (
        <tr key={"item-" + i}>
          <td>
            <input
              type="text"
              value={o}
              onChange={context.handleItemChanged.bind(context, i)}
            />
          </td>
          <td>
            <button
              onClick={context.handleItemDeleted.bind(context, i)}
            >
              Delete
            </button>
          </td>
        </tr>
      );*/
        
      return h("tr", {key: "item-" + i}, 
                h("td", null,
                  h("input", {
                    type: "text",
                    value: o,
                    onChange: context.handleItemChanged.bind(context, i)
                  })),
                h("td", null, 
                  h("button", {
                    onClick: context.handleItemDeleted.bind(context, i)
                  }, 
                    "Delete"
                  )
                )
              );
    });
  },
  
  render() {
    return h("div", null, 
      h("table", {className: ""}, 
        h("thead", null,
          h("tr", null,
            h("th", null, "Item"),
            h("th", null, "Actions")
          )
        ),
        h("tbody", null, 
          this.renderRows()
        )
      ), 
      h("hr", null), 
      h("input", {
        type: "text",
        value: this.state.message,
        onChange: this.updateMessage.bind(this)
      }),
      h("button", {onClick: this.handleClick.bind(this)}, 
        "Add Item"
      )
    )
  }
})

CMS.registerWidget('markup', TableControl, TablePreview);//, schema);
