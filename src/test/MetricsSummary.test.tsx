import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { inventoryApi } from "../redux/api/inventoryApi";
import { MetricsSummary } from '../products/components/MetricsSummary';


const mockStore = configureStore({
  reducer: {
    [inventoryApi.reducerPath]: inventoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(inventoryApi.middleware),
});

describe("MetricsSummary Component", () => {
  test("Loading elements render", () => {
    render(
      <Provider store={mockStore}>
        <MetricsSummary />
      </Provider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

  });
});