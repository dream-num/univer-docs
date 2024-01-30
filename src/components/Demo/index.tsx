import { useEffect, useMemo, useState } from 'react'
import JSPlayground from '../JSPlayground/index'
import styles from './index.module.less'

interface IEmbedProps {
  title: string
  src: string
}

interface IDemo {
  title: string
  children: IEmbedProps[]
}

interface IProps {
  demo: IDemo[]
}

export function Demo(props: IProps) {
  const { demo } = props

  const [keyword, setKeyword] = useState('')
  const [activeDemo, setActiveDemo] = useState<IEmbedProps>()

  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get('title')

    if (query) {
      const item = demo.find(group => group.children.some(item => item.title === query))
      if (item) {
        setActiveDemo(item.children.find(item => item.title === query))
      }
    } else {
      setActiveDemo(demo[0].children[0])
    }
  }, [])

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = (e.target as HTMLInputElement).value
    setKeyword(value)
  }

  const filteredDemo = useMemo(() => {
    if (!keyword) {
      return demo
    }

    return demo.map(group => ({
      ...group,
      children: group.children.filter(item => item.title.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())),
    })).filter(group => group.children.length)
  }, [keyword])

  return (
    <section className={styles.container}>
      <aside className={styles.menu}>
        <h2 className={styles.title}>Menu</h2>

        <input
          className={styles.search}
          placeholder="Search"
          value={keyword}
          onInput={handleSearch}
        />

        <ul>
          {filteredDemo.map(group => (
            <li key={group.title}>
              <label>{group.title}</label>

              <ul>
                {group.children.map(item => (
                  <li key={item.title}>
                    <a
                      className={item.src === activeDemo?.src ? styles.active : ''}
                      href={`?title=${item.title}`}
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </aside>

      <main className={styles.main}>
        {
          acteiveDemo?.type === 'jsPlayground'
            ? <JSPlayground />
            : (
<iframe
  className={styles.iframe}
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  title={activeDemo?.title}
  src={activeDemo?.src}
/>
              )
        }
      </main>
    </section>
  )
}
