const mutationResolvers = require("./mutationResolvers");
const queryResolvers = require("./queryResolvers");
const { gql } = require("apollo-server-express");

const sectionTypeDefs = gql`
  input insertSectionInput {
    id: ID!
    title: String!
    label: String!
    pos: Int!
  }

  input updateSectionPosInput {
    sectionId: String!
    pos: Int!
  }

  input insertProjectId {
    projectId: ID!
  }

  type Section {
    id: ID!
    title: String!
    label: String!
    pos: Int!
    description: String
    cards: [Card]
  }

  extend type Query {
    getSections: [Section]
    getSectionsById(ids: [ID]!): [Section]
  }

  extend type Mutation {
    insertSection(request: insertSectionInput): Section
    updateSectionPos(request: updateSectionPosInput): Section
    addInitialSections(request: insertProjectId): Section
  }
`;

const sectionResolvers = {
  Query: {
    ...queryResolvers,
  },
  Mutation: {
    ...mutationResolvers,
  },
};

module.exports = {
  sectionTypeDefs,
  sectionResolvers,
};
