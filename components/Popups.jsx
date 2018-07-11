import React from 'react';
import Popup from "reactjs-popup";

class Popups extends React.Component {
    render() {
        return (
            <div>
                <Popup trigger={<a className="button"> Course name </a>} modal>
                    {close => (
                        <div className="modal">
                            <a className="close" onClick={close}>
                                &times;
                            </a>
                            <div className="header"> Course info</div>
                            <div className="content">
                                {" "}
                                Course description
                                <br/>
                                Course prerequirements
                            </div>
                        </div>
                    )}
                </Popup>
            </div>
        )
    }
}

export default Popups