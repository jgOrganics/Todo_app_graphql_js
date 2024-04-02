import { gql } from "@apollo/client";
export const CREATE_TODO = gql`
mutation createTodo($title: String!, $description: String!) {
    createTodo(title: $title, description: $description) {
      id
      title
      description
    }
  }
`;


export const UPDATE_TODO =gql`
mutation updateTodo($id: ID!, $title: String, $description: String) {
    updateTodo(id: $id, title: $title, description: $description) {
      id
      title
      description
    }
  }
`;

export const DELETE_TODO = gql`
mutation deleteTodo($id: ID!) {
    removePost(id: $id) {
      id
    }
  }
`;