import React, { useState } from "react";
import PT from "prop-types";
import ReactDOM from "react-dom";
import {
    LightgalleryProvider,
    LightgalleryItem,
    withLightgallery,
    useLightgallery
} from "react-lightgallery";
import "lightgallery.js/dist/css/lightgallery.css";

const GROUP1 = [
    [
        "https://images.unsplash.com/photo-1592549585866-486f41343aaf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
        "https://images.unsplash.com/photo-1592549585866-486f41343aaf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
    ],
    [
        "https://images.unsplash.com/photo-1594614271360-0ed9a570ae15?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
        "https://images.unsplash.com/photo-1594614271360-0ed9a570ae15?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
    ]
];

const PhotoItem = ({ image, thumb, group }) => (
    <div style={{ maxWidth: "250px", width: "100px", padding: "5px" }}>
        <LightgalleryItem group={group} src={image} thumb={thumb}>
            <img src={image} maxWidth='250px' width='100px' padding='5px' />
        </LightgalleryItem>
    </div>
);
PhotoItem.propTypes = {
    image: PT.string.isRequired,
    thumb: PT.string,
    group: PT.string.isRequired
};

function ImgGallery() {
    const [visible, setVisible] = useState(true);
    return (
        <div className="content">
            <div>
                <LightgalleryProvider>
                    <h1 style={{ textAlign: "center" }}>Group 1</h1>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        {GROUP1.map((p, idx) => (
                            <PhotoItem key={idx} image={p[0]} thumb={p[1]} group="group1" />
                        ))}
                    </div>
                </LightgalleryProvider>
            </div>
        </div>
    );
}

export default ImgGallery;