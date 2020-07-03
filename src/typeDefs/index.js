import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type Query {
    projects: [Project!]!
    project(id: ID!): Project
  }

  type Mutation {
    addProject(title: String! ): Project
  }

  type Project {
    id: ID!
    title: String!,
    lists: [List]
  }

  type List {
    id: ID!,
    header: String!,
    cards: [Card]
  }

  type Card {
    id: ID!,
    title: String!,
    content: String
  }
`

export default typeDefs