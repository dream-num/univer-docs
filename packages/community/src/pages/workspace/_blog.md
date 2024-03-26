---
title: Introducing Univer
description: A Revolution in Collaborative Productivity
video: https://www.youtube.com/embed/kpV0MvQuFZA?si=aVLeeH-OBwec7eNo
---

Univer was born from a simple yet profound insight: the need for a seamless, integrated platform where work flows freely, without the constraints of disjointed contexts or the hassle of switching formats. With Univer, we enable users to create any forms of page as they wish. By merging sheet, doc and slide into a singular file, Univer empowers teams to manage, create, and collaborate without barriers.

## All-In-One Solution

Univer has embraced cutting-edge architectural concepts to achieve an all-in-one solution through documents, files and formats. We abstracted productivity tools into three key applications: table, text, and canvas. Through a unified design, these three applications are able to share one core architectural framework. Furthermore, by implementing the plug-in architecture, common functionalities such as images, shapes, charts, and comments can be reused across all three applications.

<video
  src="https://docs-assets-us-west.oss-us-west-1.aliyuncs.com/univer.ai/workspace/blog-all-in-one.mp4"
  controls
/>

<figcaption>This approach also enables data to be shared and exchanged between applications.</figcaption>

Taking the toolbar as an example, the @univerjs/ui plugin offers the IMenuService for registering menu items, as well as rendering the toolbar for desktop environment. Meanwhile, the @univerjs/sheets-ui and @univerjs/docs-ui plugins can implement the right-click menu items for spreadsheets and documents, respectively, and register these items with IMenuService. When registering menu items, plugins can determine to show or hide certain menu items by specifying the hidden$ property, such as hiding all spreadsheet menus if the input focus is not on a spreadsheet. This approach not only provides consistent user interaction across various document formats, but also renders the correct buttons based on the type of document the user is currently working with.

![](/workspace/img1.png)

Univer’s infrastructure integrates plugins with universality and inclusivity in mind, supporting features like:

- shortcut key
- copy&paste
- collaborative editing
- find&replace, etc.

For detailed information, please check out the [Univer Architecture Document](/guides/concepts-and-architecture/architecture).

## Formula Engine Linking Diffent Documents

The primary challenge of Univer’s formula engine is to support various applications such as table, text, and canvas, along with associated capabilities such as condition format, data validation, and pivot table to be integrated into the formula dependency calculation mechanism. And of course, we don’t accept any compromise in performance and stability when developing this formula engine.

<video
  src="https://docs-assets-us-west.oss-us-west-1.aliyuncs.com/univer.ai/workspace/blog-formula.mp4"
  controls
/>

Specifically, when loading a Foreign Formula Field, the formula would register its dependencies to the formula engine's Dependency module. You can assume the Foreign Formula Field as a cell in a virtual worksheet, and the advantage of this approach is that it implements formula dependency and calculation cohesively. Once the formula calculation is done, one can intercept the operation of writing the calculation results to the virtual worksheet, and ultimately write the calculation results into the cache of the Foreign Formula Field. For detailed information, please check out the [Formula Engine Architecture Document](/guides/concepts-and-architecture/formula).

![](/workspace/img2.png)

Additionally, Univer’s formula engine now supports executing calculation within web-worker, allowing formula calculation with zero blockage for user experience. More importantly, we aimed to make cross-thread communication between the main-thread and web-worker as straightforward as communicating within the same thread. To achieve this, we developed the @univerjs/rpc plugin. For detailed information, please check out the [Web Worker Architecture Document](/guides/concepts-and-architecture/web-worker).

<video
  src="https://docs-assets-us-west.oss-us-west-1.aliyuncs.com/univer.ai/workspace/formula20000.mp4"
  controls
/>

<figcaption>Univer does not block user experience when computing 20,000 functions.</figcaption>

## AI-Drive Automation with Command System

Data is vital for AI applications. We strongly believe in the power of converting user behavior into data for AI training, which can lead to revolution breakthrough in the office domain. This is why we created Uniscript, by integrating it with the command system, we’ve taken steps from learning user behaviors to applying them in everyday scenarios. Univer’s AI-powered Uniscript opens new horizons for workflow automation. From generating tailored report templates to integrating specific data sources, Uniscript transforms tedious, repetitive tasks into automated processes.

<video
  src="https://docs-assets-us-west.oss-us-west-1.aliyuncs.com/univer.ai/workspace/uniscript.mp4"
  controls
/>

<figcaption>Execute Uniscript code to generate the Univer logo.</figcaption>

The command system opens up numerous possibilities for Univer, transforming user actions into digital user behavior. By recording and replaying these data, it enables functionalities like undo/redo, collaborative editing, offline cache, live share, and server-side computing. Moreover, this data on user behavior can be utilized for AI training, unlocking endless potentials for efficiency.

![](/workspace/img3.png)

<video
  src="https://docs-assets-us-west.oss-us-west-1.aliyuncs.com/univer.ai/workspace/live-share.mp4"
  controls
/>

<figcaption>The live share feature implemented by the command system.</figcaption>

## Compatibility with Office File Formats

Despite the vast array of SaaS productivity tools in the market, Office and Google Suite are still the most widely adopted. Therefore, our strategy focuses on maintaining compatibility with traditional formats while optimizing the user experience to boost productivity. To achieve this, we’ve developed a set of import/export feature, which ensures maximum format compatibility.

<video
  src="https://docs-assets-us-west.oss-us-west-1.aliyuncs.com/univer.ai/workspace/import-and-export-text.mp4"
  controls
/>

<figcaption>Import and Export xlsx Files, online demo.</figcaption>

| Spread Cell Count              | Import (s) | Export (s) |
| :----------------------------- | :--------- | :--------- |
| 100k (500rows/50cols/4sheets)  | 1.3        | 1.1        |
| 500k (2500rows/50cols/4sheets) | 6.6        | 5.6        |
| 1m (5000rows/50cols/4sheets)   | 13.4       | 11.6       |
| 5m (25000rows/50cols/4sheets)  | 67.8       | 60.7       |
| 10m (50000rows/50cols/4sheets) | 135.9      | 115.5      |

Import and Export Performance Benchmark

## General Render Engine

To enhance the integration of doc, sheet, and slide for an unparalleled experience, Univer has developed a rendering engine based on canvas. As a result, Univer’s cell editor, formula editor, and document all share the same typesetting capability. This innovation pushes us to rethink the limitation of a spreadsheet cell: why can’t a cell also function as a document?

For an illustration of how this works, please check out the example below.

<video
  src="https://docs-assets-us-west.oss-us-west-1.aliyuncs.com/univer.ai/workspace/zen-editor.mp4"
  controls
/>

<figcaption>Univer's Full-screen editing feature.</figcaption>

A more complex and intriguing challenge would be: How can we enable doc, sheet and slide to nest with each other, and render on the same canvas?

![](/workspace/img4.png)

<video
  src="https://docs-assets-us-west.oss-us-west-1.aliyuncs.com/univer.ai/workspace/nested.mp4"
  controls
/>

<figcaption>Insert sheet/doc into Univer Slide</figcaption>

For detailed information, please check out the [Architecture of Rendering Engine Document](/guides/concepts-and-architecture/rendering).

## Collaborative Editing Across All Document Types

In Univer, the presence of various document types makes collaborative editing a complex issue, involving cross-platform consistency, offline availablity, history log, undo&redo, etc. Since data processing is the priority for this platform, to better adapt to collaborative tasks in spreadsheet related scenarios and preserve user intent, we ultimately chose the [Operational Transformation](https://en.wikipedia.org/wiki/Operational_transformation) collaborative solution (OT). For detailed information, please check out the [OT algorithm and Univer's Collaborative Editing Design Document](/blog/ot).

<video
  src="https://docs-assets-us-west.oss-us-west-1.aliyuncs.com/univer.ai/workspace/collaboration-playground.mp4"
  controls
/>

<figcaption>Univer Collaborative Editing Debugging Environment</figcaption>

Additionally, we’ve fully reused the collaborative scheduling algorithm. For every document, a collaborationEntity is generated by the collaborative editing module to manage its scheduling. Regarding Operational Transformation, we’ve developed a TransformService that allows Operational Transformation algorithm to be registered. Users can simply implement Operational Transformation algorithm, register it with TransformService, and then seamlessly integrate into the collaborative editing module.

![](/workspace/img5.png)

The Univer server focuses on scalability and performance, designed to support distributed systems for greater concurrency and performance. It primarily uses two programming languages: Golang and Node.js. Golang excels in handling intense concurrency and rapid network I/O, allowing the Univer collaboration engine to easily handle excessive client connection requests. Node.js shares JavaScript code with the frontend, significantly reducing the error rate in handling collaborative conflicts and establishing a crucial foundation for future server-side computation and rendering.

![](/workspace/img6.png)

<video
  src="https://docs-assets-us-west.oss-us-west-1.aliyuncs.com/univer.ai/workspace/micky.mp4"
  controls
/>

<figcaption>Create a cute Mickey Mouse using Univer collaborative editing service.</figcaption>

The Univer Collaboration Engine performs excellently while ensuring stability and reliability. The benchmark test results of the Univer Collaboration Engine on a 4C8G server are as follows: simulating 100 users randomly editing the same table every 2 seconds. In the graph, the horizontal axis represents natural time (milliseconds), and the vertical axis represents collaboration delay (milliseconds), which is the delay from when an event is initiated by a client to when it is seen by others. **We can see that over 95% of editing events have a delay of less than 200ms!**

![](/workspace/img7.jpg)

<figcaption>Collaborative editing benchmark.</figcaption>

## Solutions

Open-source Version
https://univer.ai/
SaaS Version - coming soon
https://univer.ai/workspace/

In our technical blog, we will periodically update articles about Univer's core technology, for example:

- [Document Typesetting Design](/blog/doc-typesetting-design)
- [Univer Document Architecture](/blog/univer-doc-architecture)

For Developers, by Developers
We’re building Univer not just as a tool, but as a collaborative productivity platform. We’re keen to hear your thoughts, feedback, and how you envision using Univer in your workflow. Join our Discord group chat to dive deeper into discussions, share insights, and connect with fellow users to explore the possibility of Univer. Let’s build better, together.

- [Discord](https://discord.gg/z3NKNT6D2f)
- [Github](https://github.com)
