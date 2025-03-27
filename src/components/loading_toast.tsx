
import React, { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { on } from 'events';
//
interface LoadingToastProps {
    onShow: boolean;
}
//
const LoadingToast: React.FC<LoadingToastProps> = ({ onShow }) => {
   ///========================================================
   // To show a loading toast
   ///========================================================
   //TODO to check if its needed to be implemented.
    const toast = useRef<Toast>(null);
    const [progress, setProgress] = useState(0);
    const interval = useRef<number | null>(null);

    const clear = () => {
        setProgress(0);
        toast.current?.clear();
        if (interval.current !== null) {
            clearInterval(interval.current);
        }
        interval.current = null;
    };
    //
    const show = () => {
        if (!interval.current) {
            toast.current?.show({
                summary: 'Sending the article',
                detail: 'Please wait...',
            });

            setProgress(0);

            if (interval.current) {
                clearInterval(interval.current);
            }

            interval.current = window.setInterval(() => {
                setProgress((prevProgress) => {
                    const newProgress = prevProgress + 30;

                    if (newProgress >= 100) {
                        clear();
                        return 100;
                    }

                    return newProgress;
                });
            }, 1000);
        }
    };
    //
    useEffect(() => {
    if(onShow) {
        show();
    }}, [onShow]);
    //
    return (
        <div className="card flex m-0 bg-green">
            <Toast
                ref={toast}
                content={({ message }) => (
                    <section className="flex p-3 gap-3 w-full bg-black-alpha-90 shadow-2 fadeindown" style={{ borderRadius: '10px' }}>
                        <i className="pi pi-cloud-upload text-primary-500 text-2xl"></i>
                        <div className="flex flex-column gap-3 w-full">
                            <p className="m-0 font-semibold text-base text-white">{message.summary}</p>
                            <p className="m-0 text-base text-700">{message.detail}</p>
                            <div className="flex flex-column gap-2">
                                <ProgressBar value={progress} showValue={false}></ProgressBar>
                                {/* <label className="text-right text-xs text-white">{progress}% uploaded...</label> */}
                            </div>
                            {/* <div className="flex gap-3 mb-3">
                            <Button label="Another Upload?" text className="p-0" onClick={clear}></Button>
                            </div> */}
                        </div>
                    </section>
                )}
            ></Toast>
            <Button onClick={show} label="View" />
        </div>
    )};

export default LoadingToast;