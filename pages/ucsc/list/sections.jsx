import React from 'react';
import Link from 'next/link';

import Header from '../../../components/Header';

export default () => (
  <div>
    <Header/>
    <h1>Placeholder pages</h1>
    <Link href="/ucsc">
      <a>Go black</a>
    </Link>
  </div>
);
