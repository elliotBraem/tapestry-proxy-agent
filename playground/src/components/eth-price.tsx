import { useWorker } from "@/contexts/worker-context";
import { Button } from "./ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getContractPrice,
  prepareUpdatePriceData,
  ethContractAddress,
} from "@/lib/eth-oracle";
import { getEthereumPriceUSD } from "@/lib/fetch-eth-price";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { toast } from "sonner";

export function EthPrice() {
  const { sendTransaction, isConnected } = useWorker();
  const queryClient = useQueryClient();

  const { data: contractPrice, isLoading: isContractPriceLoading } = useQuery({
    queryKey: ["contractPrice"],
    queryFn: getContractPrice,
  });

  const { data: latestPrice, isLoading: isLatestPriceLoading } = useQuery({
    queryKey: ["latestEthPrice"],
    queryFn: getEthereumPriceUSD,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { mutate, isPending: isUpdating } = useMutation({
    mutationFn: async (price: number) => {
      const data = prepareUpdatePriceData(price);
      await sendTransaction("eth", ethContractAddress, data);
    },
    onSuccess: () => {
      toast.success("Price updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["contractPrice"] });
    },
    onError: (error) => {
      toast.error(`Failed to update price: ${error.message}`);
    },
  });

  const handleSetPrice = () => {
    if (latestPrice) {
      mutate(latestPrice);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Eth Price Oracle</CardTitle>
        <CardDescription>
          View the current on-chain price and update it with the latest fetched
          price.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-gray-600 space-y-2">
        <p>
          <span className="font-medium">Current On-Chain Price:</span>{" "}
          {isContractPriceLoading ? "Loading..." : `$${contractPrice}`}
        </p>
        <p>
          <span className="font-medium">Latest Fetched Price:</span>{" "}
          {isLatestPriceLoading
            ? "Loading..."
            : latestPrice
            ? `$${(latestPrice / 100).toFixed(2)}`
            : "N/A"}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSetPrice}
          disabled={isUpdating || !latestPrice || !isConnected}
        >
          {isUpdating ? "Updating..." : "Set Eth Price"}
        </Button>
      </CardFooter>
    </Card>
  );
}
