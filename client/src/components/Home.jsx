import React from 'react';
import "./home.css"
import Category from './Categories/Category';

const Home = () => {
  return (
    <div>
      <main className="p-5 w-full">
        <section className="container flex flex-col md:flex-row items-center justify-between gap-8 py-12 md:py-24 lg:py-32">
          <div className="flex-1 space-y-4 text-left md:pr-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Unlock Your Potential with Our Solutions
            </h1>
            <h2 className="text-xl text-muted-foreground md:text-2xl">
              Empower your business with our cutting-edge technology.
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Our innovative products and services are designed to help you streamline your operations, boost productivity, and stay ahead of the competition. Experience the difference with our industry-leading solutions.
            </p>
          </div>
          <div className="flex-1 flex items-start md:items-center justify-center md:justify-end relative">
            <img
              src="https://images.unsplash.com/photo-1516888693095-f0e05366ddc6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGFudGlxdWVzfGVufDB8fDB8fHww"
              width={500}
              height={500}
              alt="Hero Image"
              className="hero-image max-w-[400px] rounded-lg shadow-xl md:max-w-none"
            />
          </div>
        </section>
      </main>
      <Category/>
    </div>
  );
}

export default Home;
