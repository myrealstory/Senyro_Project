interface Type {
  type: string;
  typeTC?: string;
  days: string;
  membershipTime: string;
  description: string;
}

interface TermItems {
  id: number;
  title?: string;
  titleTC?: string;
  content?: string;
  contentTC?: string;
  content2?: string;
  content2TC?: string;
  type?: Type[];
  membershipTime?: string;
  description?: string;
}

interface Sections {
  title: string;
  titleTC?: string;
  content?: string;
  terms: TermItems[];
}

export interface Terms {
  id: number;
  title: string;
  titleTC?: string;
  updated: string;
  updatedTC?: string;
  description: string;
  descriptionTC?: string;
  sections: Sections[];
}

export type Policies = Terms;

export type Memberships = Terms;
