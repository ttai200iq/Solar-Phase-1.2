import React, { useEffect, useReducer } from "react";
import "./Alert.scss";
import { signal } from "@preact/signals-react";

const show = signal('none');
const content = signal('...');

export const alertDispatch = (text) => {
    show.value = 'block'
    content.value = text
}

export default function Alert(props) {
    const intervalIDRef = useReducer(null);

    useEffect(() => {
        var i = 0
        var startTimer = () => {
            intervalIDRef.current = setInterval(async () => {
                i += 1
                if (i === 2) {
                    show.value = 'none';
                    content.value = '...';
                }
            }, 1000);
        };

        var stopTimer = () => {
            clearInterval(intervalIDRef.current);
            intervalIDRef.current = null;
        };

        if (show.value === 'block') {
            startTimer();
        } else {
            stopTimer()
        }

        return () => {
            clearInterval(intervalIDRef.current);
            intervalIDRef.current = null;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show.value])

    return (
        <div className="DAT_Alert" style={{ display: show.value }}>
            <div className="DAT_Alert_Content">
                <label >{content.value}</label>
            </div>
        </div>
    )
}