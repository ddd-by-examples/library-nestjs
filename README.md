# Table of contents

- [Table of contents](#table-of-contents)

  - [About](#about)
  - [Domain description](#domain-description)
  - [General assumptions](#general-assumptions)
    - [Process discovery](#process-discovery)
    - [Project structure and architecture](#project-structure-and-architecture)
    - [Architecture-code gap](#architecture-code-gap)
    - [NestJS](#nestjs)
  - [How to contribute](#how-to-contribute)
  - [References](#references)

- [How to contribute](#how-to-contribute)
- [References](#references)

## About

This project is an implementation of the well-known [ddd-by-examples/library](https://github.com/ddd-by-examples/library), but this time using TypeScript and Node.js.

This is a project of a library, driven by real [business requirements](#domain-description).
We use techniques strongly connected with Domain Driven Design, Behavior-Driven Development,
Event Storming, User Story Mapping.

**The project is currently under development. Some solutions are temporary and may change.**

## Domain description

A public library allows patrons to place books on hold at its various library branches.
Available books can be placed on hold only by one patron at any given point in time.
Books are either circulating or restricted, and can have retrieval or usage fees.
A restricted book can only be held by a researcher patron. A regular patron is limited
to five holds at any given moment, while a researcher patron is allowed an unlimited number
of holds. An open-ended book hold is active until the patron checks out the book, at which time it
is completed. A closed-ended book hold that is not completed within a fixed number of
days after it was requested will expire. This check is done at the beginning of a day by
taking a look at daily sheet with expiring holds. Only a researcher patron can request
an open-ended hold duration. Any patron with more than two overdue checkouts at a library
branch will get a rejection if trying a hold at that same library branch. A book can be
checked out for up to 60 days. Check for overdue checkouts is done by taking a look at
daily sheet with overdue checkouts. Patron interacts with his/her current holds, checkouts, etc.
by taking a look at patron profile. Patron profile looks like a daily sheet, but the
information there is limited to one patron and is not necessarily daily. Currently a
patron can see current holds (not canceled nor expired) and current checkouts (including overdue).
Also, he/she is able to hold a book and cancel a hold.

How actually a patron knows which books are there to lend? Library has its catalogue of
books where books are added together with their specific instances. A specific book
instance of a book can be added only if there is book with matching ISBN already in
the catalogue. Book must have non-empty title and price. At the time of adding an instance
we decide whether it will be Circulating or Restricted. This enables
us to have book with same ISBN as circulated and restricted at the same time (for instance,
there is a book signed by the author that we want to keep as Restricted)

## General assumptions

### Process discovery

The first thing we started with was domain exploration with the help of Big Picture EventStorming.
The description you found in the previous chapter, landed on our virtual wall:  
![Event Storming Domain description](docs/images/eventstorming-domain-desc.png)  
The EventStorming session led us to numerous discoveries, modeled with the sticky notes:  
![Event Storming Big Picture](docs/images/eventstorming-big-picture.jpg)  
During the session we discovered following definitions:  
![Event Storming Definitions](docs/images/eventstorming-definitions.png)

This made us think of real life scenarios that might happen. We discovered them described with the help of
the **Example mapping**:  
![Example mapping](docs/images/example-mapping.png)

This in turn became the base for our _Design Level_ sessions, where we analyzed each example:  
![Example mapping](docs/images/eventstorming-design-level.jpg)

Please follow the links below to get more details on each of the mentioned steps:

- [Big Picture EventStorming](./docs/big-picture.md)
- [Example Mapping](docs/example-mapping.md)
- [Design Level EventStorming](docs/design-level.md)

### Project structure and architecture

At the very beginning, not to overcomplicate the project, we decided to assign each bounded context
to a separate package, which means that the system is a modular monolith. There are no obstacles, though,
to put contexts into maven modules or finally into microservices.

Bounded contexts should (amongst others) introduce autonomy in the sense of architecture. Thus, each module
encapsulating the context has its own local architecture aligned to problem complexity.
In the case of a context, where we identified true business logic (**lending**) we introduced a domain model
that is a simplified (for the purpose of the project) abstraction of the reality and utilized
hexagonal architecture. In the case of a context, that during Event Storming turned out to lack any complex
domain logic, we applied CRUD-like local architecture.

### Architecture-code gap

We put a lot of attention to keep the consistency between the overall architecture (including diagrams)
and the code structure. Having identified bounded contexts we could organize them as a set of libraries (one of the reasons why Nx is used). Thanks to this we gain the famous microservices' autonomy, while having a monolithic
application (modular monolith). Each package has well defined public API, encapsulating all implementation details by using
_nx-enforce-module-boundaries_.

Just by looking at the package structure:

```
└── libs
    ├── catalogue
    └── lending
        ├── application
        ├── infrastructure
        ├── ui-rest
        └── domain/
            ├── /book
            ├── /dailysheet
            ├── /librarybranch
            ├── /patron
            └── /patronprofile
```

you can see that the architecture is screaming that it has two bounded contexts: **catalogue**
and **lending**. Moreover, the **lending context** is built around five business objects: **book**,
**dailysheet**, **librarybranch**, **patron**, and **patronprofile**, while **catalogue** has no sublibraries,
which suggests that it might be a CRUD with no complex logic inside. Please find the architecture diagram
below.
You may ask why, unlike a Java project, all business objects don't have their own hexagonal libraries. Indeed all business objects have now only their own catalog in each tier.
We changed that here because in Java these libraries made extensive use of each other, while in Node.js it will produce a circular dependency. So, when two libraries strongly depend on each other, they have to be merged together.

![Component diagram](docs/c4/component-diagram.png)

Yet another advantage of this approach comparing to packaging by layer for example is that in order to
deliver a functionality you would usually need to do it in one package only, which is the aforementioned
autonomy. This autonomy, then, could be transferred to the level of application as soon as we split our
_context-packages_ into separate microservices. Following this considerations, autonomy can be given away
to a product team that can take care of the whole business area end-to-end.

#### NestJS

NestJS is taking a big part of the market. Currently, the most popular framework is still Express, but for complex business applications, NestJS will fit better, thanks to its advanced Dependency Injection system, TypeScript as the main language, and many out-of-the-box solutions that make the development more organized and standardized from the very begging.

In oposite to the goal from the [ddd-by-examples/library#spring](https://github.com/ddd-by-examples/library#spring), we will not categorically avoid dependence on our framework. As Eric Evans said in his book

> The best architectural frameworks solve complex technical
> problems while allowing the domain developer to concentrate on expressing a model. But frameworks can easily get in the way, either by making too many assumptions that constrain domain
> design choices or by making the implementation so heavyweight that development slows down.

Following that sentence, we will try still using the framework in a few places to speed up the development without strongly affecting the structure of our model.

## How to contribute

The project is still under construction, so if you like it enough to collaborate, just let us
know or simply create a Pull Request.

## References

1. [Introducing EventStorming](https://leanpub.com/introducing_eventstorming) by Alberto Brandolini
2. [Domain Modelling Made Functional](https://pragprog.com/book/swdddf/domain-modeling-made-functional) by Scott Wlaschin
3. [Software Architecture for Developers](https://softwarearchitecturefordevelopers.com) by Simon Brown
4. [Clean Architecture](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164) by Robert C. Martin
5. [Domain-Driven Design: Tackling Complexity in the Heart of Software](https://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215) by Eric Evans
