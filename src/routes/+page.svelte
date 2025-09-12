<main class="main-container">
    <h1 class="title">Tram & Bass International</h1>

    <div class="links-container">
        <a href="/zurich" class="link-box">
            <span class="link-name">Zürich</span>
        </a>

        <a href="/chemnitz" class="link-box">
            <span class="link-name">Chemnitz</span>
        </a>
    </div>
</main>

<style>
    .main-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 100vh;
        padding: 2rem;
        font-family: "Arial", sans-serif;
    }

    .title {
        font-size: 3rem;
        font-weight: bold;
        color: white;
        text-align: center;
        margin-bottom: 3rem;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        letter-spacing: 2px;
    }

    .links-container {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
        justify-content: center;
        max-width: 1200px;
        width: 100%;
    }

    .link-box {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 200px;
        height: 120px;
        border-radius: 15px;
        text-decoration: none;
        color: white;
        transition: all 0.3s ease;
        border: 2px solid white;
    }

    .link-box:hover {
        background: white;
        color: black;
    }

    .link-name {
        font-size: 1.5rem;
        font-weight: 600;
        text-align: center;
    }

    /* Responsive design for smaller screens */
    @media (max-width: 768px) {
        .title {
            font-size: 2rem;
            margin-bottom: 2rem;
        }

        .links-container {
            flex-direction: column;
            align-items: center;
        }

        .link-box {
            width: 100%;
            max-width: 300px;
        }
    }

    /* Responsive design for very small screens */
    @media (max-width: 480px) {
        .main-container {
            padding: 1rem;
        }

        .title {
            font-size: 1.5rem;
        }

        .link-box {
            height: 100px;
            min-width: 150px;
        }

        .link-name {
            font-size: 1.2rem;
        }
    }
</style>
