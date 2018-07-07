import React from 'react';

import Link from 'next/link'
import {connect} from 'react-redux'
import Clock from './Clock'
import AddCount from './AddCount'
import Popups from './Popups'

export default connect(state => state)(({title, linkTo, lastUpdate, light}) => {
    return (
        <div>
            <h1>{title}</h1>
            <Clock lastUpdate={lastUpdate} light={light}/>
            <AddCount/>
            <nav>
                <Link href={{linkTo}}><a>Navigate</a></Link>
            </nav>
            <Popups>Course name</Popups>
        </div>
    )
})
