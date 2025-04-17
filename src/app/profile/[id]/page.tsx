import * as React from 'react';

export default function Profile({params }: any) {
    return (
        <div>
            <h1>Hello <span className='bg-amber-200 ml-1'>{params.id}</span></h1>
        </div>
    );
}