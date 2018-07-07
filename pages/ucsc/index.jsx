import React from 'react';
import Link from 'next/link';

export default () => (
  <div>This is the UCSC index page.
    <ul>
      <li><Link href="/ucsc/list/courses"><a>courses</a></Link></li>
      <li><Link href="/ucsc/list/locations"><a>locations</a></Link></li>
      <li><Link href="/ucsc/list/professors"><a>Professors</a></Link></li>
      <li><Link href="/ucsc/list/sections"><a>Sections</a></Link></li>
      <li><Link href="/ucsc/list/terms"><a>Terms</a></Link></li>
    </ul>
  </div>
);
