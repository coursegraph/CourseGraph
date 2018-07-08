import React from 'react';
import Link from 'next/link';

import Header from '../../components/Header';

export default () => (
  <div>
    <Header/>
    <h1> This is the UCSC placeholder page </h1>
    <ul>
      <li><Link href="/ucsc/list/courses"><a>courses</a></Link></li>
      <li><Link href="/ucsc/list/locations"><a>locations</a></Link></li>
      <li><Link href="/ucsc/list/professors"><a>Professors</a></Link></li>
      <li><Link href="/ucsc/list/sections"><a>Sections</a></Link></li>
      <li><Link href="/ucsc/list/terms"><a>Terms</a></Link></li>
    </ul>
  </div>
);
