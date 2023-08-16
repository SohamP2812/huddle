/* eslint-disable */

import * as controlBossInternal from "control-boss";

const projectId = "clkyx7d6g0005keeq2e3r1ek0"

export const AnotherNameKey: FeatureFlag<"AnotherNameKeyType"> = {
  __typename: "AnotherNameKeyType",
  id: "cll07vbo80000kemnivkvs8e6",
  key: "AnotherNameKey",
 defaultValue: `{"value":{"name":"aa aa a"}}`,
}; 

export const Test2: FeatureFlag<"Test2Type"> = {
  __typename: "Test2Type",
  id: "cll0gcgw70004kemn66u11itz",
  key: "Test2",
 defaultValue: `{"value":"defaultstringv"}`,
}; 

export const SecondFeature: FeatureFlag<"SecondFeatureType"> = {
  __typename: "SecondFeatureType",
  id: "cll0gdlpl0005kemn13sjp4io",
  key: "SecondFeature",
 defaultValue: `{"value":{"id":10,"email":"myemail","username":"myusername"}}`,
}; 

export const Test2BOOOL: FeatureFlag<"Test2BOOOLType"> = {
  __typename: "Test2BOOOLType",
  id: "cll677pcd0000kez79a3re955",
  key: "Test2BOOOL",
 defaultValue: `{"value":false}`,
}; 

export const NUMBER: FeatureFlag<"NUMBERType"> = {
  __typename: "NUMBERType",
  id: "cll67pq0m0001kez7ebmmjc29",
  key: "NUMBER",
 defaultValue: `{"value":1}`,
}; 

export const FeatureFlagKeyNew: FeatureFlag<"FeatureFlagKeyNewType"> = {
  __typename: "FeatureFlagKeyNewType",
  id: "clla0dzx10000keyzlv3u0dlj",
  key: "FeatureFlagKeyNew",
 defaultValue: `{"value":true}`,
}; 

export const MyKey: FeatureFlag<"MyKeyType"> = {
  __typename: "MyKeyType",
  id: "clla0jbuv0001keyzdrg33pwg",
  key: "MyKey",
 defaultValue: `{"value":{"name":"my default name"}}`,
}; 

export const TitleOfDashboard: FeatureFlag<"TitleOfDashboardType"> = {
  __typename: "TitleOfDashboardType",
  id: "cllcyrd850000kebrd4u8o4mg",
  key: "TitleOfDashboard",
 defaultValue: `{"value":"Dashboard"}`,
}; 

export const HuddleShowSiteStats: FeatureFlag<"HuddleShowSiteStatsType"> = {
  __typename: "HuddleShowSiteStatsType",
  id: "clldb1lk50000kel3sn8jybo8",
  key: "HuddleShowSiteStats",
 defaultValue: `{"value":false}`,
}; 

type GetTypeByName<T extends keyof TypeMap> = TypeMap[T];

type FeatureFlag<T extends keyof TypeMap> = {
  __typename: T;
  id: string;
  key: string;
  defaultValue: string;
}

namespace AnotherNameKey {
  export type Maybe<T> = T | null;
  export type InputMaybe<T> = Maybe<T>;
  export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
  export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
  export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
  export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
  export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
  /** All built-in and custom scalars, mapped to their actual values */
  export type Scalars = {
    ID: { input: string; output: string; }
    String: { input: string; output: string; }
    Boolean: { input: boolean; output: boolean; }
    Int: { input: number; output: number; }
    Float: { input: number; output: number; }
  };
  
  export type Query = {
    __typename?: 'Query';
    id: Scalars['ID']['output'];
    username: Scalars['String']['output'];
    email: Scalars['String']['output'];
    subType?: Maybe<SubType>;
  };
  
  export type SubType = {
    __typename?: 'SubType';
    subField?: Maybe<Scalars['String']['output']>;
  };
} 

namespace SecondFeature {
  export type Maybe<T> = T | null;
  export type InputMaybe<T> = Maybe<T>;
  export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
  export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
  export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
  export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
  export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
  /** All built-in and custom scalars, mapped to their actual values */
  export type Scalars = {
    ID: { input: string; output: string; }
    String: { input: string; output: string; }
    Boolean: { input: boolean; output: boolean; }
    Int: { input: number; output: number; }
    Float: { input: number; output: number; }
  };
  
  export type Query = {
    __typename?: 'Query';
    id: Scalars['ID']['output'];
    username?: Maybe<Scalars['String']['output']>;
    email?: Maybe<Scalars['String']['output']>;
  };
} 

namespace MyKey {
  export type Maybe<T> = T | null;
  export type InputMaybe<T> = Maybe<T>;
  export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
  export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
  export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
  export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
  export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
  /** All built-in and custom scalars, mapped to their actual values */
  export type Scalars = {
    ID: { input: string; output: string; }
    String: { input: string; output: string; }
    Boolean: { input: boolean; output: boolean; }
    Int: { input: number; output: number; }
    Float: { input: number; output: number; }
  };
  
  export type Query = {
    __typename?: 'Query';
    name?: Maybe<Scalars['String']['output']>;
  };
} 

type TypeMap = {
  AnotherNameKeyType: AnotherNameKey.Query,
  Test2Type: string,
  SecondFeatureType: SecondFeature.Query,
  Test2BOOOLType: boolean,
  NUMBERType: number,
  FeatureFlagKeyNewType: boolean,
  MyKeyType: MyKey.Query,
  TitleOfDashboardType: string,
  HuddleShowSiteStatsType: boolean,
};

export function initialize() {
  return new ControlBoss();
}

export class ControlBoss {
  controlBoss: controlBossInternal.ControlBossInternal;

  constructor() {
    this.controlBoss = controlBossInternal.initialize(projectId);
  }

  get<T extends keyof TypeMap>(featureFlag: FeatureFlag<T>): GetTypeByName<T> {
    return this.controlBoss.get(featureFlag) as GetTypeByName<T>;
  }

  initialized() {
    return this.controlBoss.initialized;
  }

  awaitReady() {
    return this.controlBoss.initPromise;
  }
}

const controlBoss = initialize();

export default controlBoss;