---
title: "@univerjs/ui"
---

[![npm version](https://img.shields.io/npm/v/@univerjs/ui)](https://npmjs.org/package/@univerjs/ui)
[![license](https://img.shields.io/npm/l/@univerjs/ui)](https://img.shields.io/npm/l/@univerjs/ui)

## Introduction

> UI plugin for Univer.

## Usage

### Installation

```shell
# Using npm
npm install @univerjs/ui

# Using pnpm
pnpm add @univerjs/ui
```

### UI service

UI services define a set of user interface services that run on the client side but are agnostic to the specific host environment (such as desktop browsers, mobile webviews, etc.). By injecting these services, business functionalities can invoke the same interfaces across different hosts without worrying about host disparities.

These UI services include:

* Menu service, used to register menu items and their associated commands.
* Shortcut service, for registering keyboard shortcuts and their corresponding commands.
* Clipboard service, to read from or write to the clipboard.
* Popup service, which includes confirmations, dialogs, and more.

### Workbench

In addition to UI services, `@univerjs/ui` also implements a workspace based on React, which includes elements such as the title bar, toolbar, main content area, context menu, sidebar, and more. Businesses can customize the rendered content using the APIs provided by the Workbench.
