import { gql } from "@apollo/client";

export const getALL = gql`
  {
    allTodos{
        id
        title
        description
      }
  }
`;