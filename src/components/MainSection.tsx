import PropTypes from "prop-types";
import React, { Component } from "react";
import { TodoFilters } from "../constants/TodoFilters";
import { Footer } from "./Footer";
import { TodoItem } from "./TodoItem";

const TODO_FILTERS = {
  [TodoFilters.SHOW_ALL]: () => true,
  [TodoFilters.SHOW_ACTIVE]: todo => !todo.completed,
  [TodoFilters.SHOW_COMPLETED]: todo => todo.completed
};

export default class MainSection extends Component {
  static propTypes = {
    todos: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  };

  state = { filter: TodoFilters.SHOW_ALL };

  private handleClearCompleted = () => {
    this.props.actions.clearCompleted();
  };

  private handleShow = filter => {
    this.setState({ filter });
  };

  private renderToggleAll(completedCount) {
    const { todos, actions } = this.props;
    if (todos.length > 0) {
      return (
        <input
          className="toggle-all"
          type="checkbox"
          checked={completedCount === todos.length}
          onChange={actions.completeAll}
        />
      );
    }
  }

  private renderFooter(completedCount) {
    const { todos } = this.props;
    const { filter } = this.state;
    const activeCount = todos.length - completedCount;

    if (todos.length) {
      return (
        <Footer
          completedCount={completedCount}
          activeCount={activeCount}
          filter={filter}
          onClearCompleted={this.handleClearCompleted}
          onShow={this.handleShow}
        />
      );
    }
  }

  public render() {
    const { todos, actions } = this.props;
    const { filter } = this.state;

    const filteredTodos = todos.filter(TODO_FILTERS[filter]);
    const completedCount = todos.reduce(
      (count, todo) => (todo.completed ? count + 1 : count),
      0
    );

    return (
      <section className="main">
        {this.renderToggleAll(completedCount)}
        <ul className="todo-list">
          {filteredTodos.map(todo =>
            <TodoItem key={todo.id} todo={todo} {...actions} />
          )}
        </ul>
        {this.renderFooter(completedCount)}
      </section>
    );
  }
}
