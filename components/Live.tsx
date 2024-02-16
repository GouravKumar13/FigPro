import React, { useCallback, useEffect, useState } from 'react'
import LiveCursor from './Cursor/LiveCursor'
import { useMyPresence, useOthers } from '@/liveblocks.config'
import CursorChat from './Cursor/CursorChat'
import { CursorMode } from '@/types/type'

const Live = () => {
    // returns the list of all the users in the block
    const others = useOthers()
    const [{ cursor }, updateMyPresence] = useMyPresence() as any;
    const [cursorState, setCursorState] = useState({
        mode: CursorMode.Hidden
    })

    const handelPointerMove = useCallback((e: React.PointerEvent) => {
        e.preventDefault()

        const x = e.clientX - e.currentTarget.getBoundingClientRect().x
        const y = e.clientY - e.currentTarget.getBoundingClientRect().y
        updateMyPresence({ cursor: { x, y } })

    }, [])
    const handelPointerLeave = useCallback((e: React.PointerEvent) => {
        setCursorState({ mode: CursorMode.Hidden })


        updateMyPresence({ cursor: null, message: null })

    }, [])
    const handelPointerDown = useCallback((e: React.PointerEvent) => {

        const x = e.clientX - e.currentTarget.getBoundingClientRect().x
        const y = e.clientY - e.currentTarget.getBoundingClientRect().y
        updateMyPresence({ cursor: { x, y } })

    }, [])

    useEffect(() => {
        const onkeyUP = (e: KeyboardEvent) => {
            if (e.key === "/") {
                setCursorState({ mode: CursorMode.Chat, previousMessage: null, message: "" })
            }
            else if (e.key === "Escape") {
                updateMyPresence({ message: "" })
                setCursorState({ mode: CursorMode.Hidden })
            }
        }
        const onkeyDown = (e: KeyboardEvent) => {
            if (e.key === "/") {
                e.preventDefault()


            }
        }
        window.addEventListener('keyup', onkeyUP)
        window.addEventListener('keydown', onkeyDown)

        return () => {
            window.removeEventListener('keyup', onkeyUP)
            window.removeEventListener('keydown', onkeyDown)
        }
    }, [updateMyPresence])



    return (
        <div className=' h-[100vh] w-full flex justify-center items-center text-center' onPointerMove={handelPointerMove} onPointerLeave={handelPointerLeave} onPointerDown={handelPointerDown}>
            <h1 className="text-2xl  text-white"> LiveBlocks Figma Clone</h1>
            {cursor && <CursorChat
                cursor={cursor}
                cursorState={cursorState}
                setCursorState={setCursorState}
                updateMyPresence={updateMyPresence}
            />}
            <LiveCursor others={others} />
        </div>
    )
}

export default Live
