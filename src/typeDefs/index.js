import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type Query {
    projects: [Project!]!
    project(id: ID!): Project
  }

  type Mutation {
    addProject(title: String! ): Feedback
    addCard(projectId: String!, listId: String!, title: String!, content: String ): Feedback
    deleteCard(projectId: String!, listId: String!, cardId: String! ): Feedback
  }

  type Project {
    id: ID!
    title: String!
    lists: [List!]!
  }

  type List {
    id: ID!
    title: String!
    cards: [Card!]!
  }

  type Card {
    id: ID!
    title: String!
    content: String
  }

  type Feedback {
    success: Boolean!
    message: String!
  }
`

export default typeDefs